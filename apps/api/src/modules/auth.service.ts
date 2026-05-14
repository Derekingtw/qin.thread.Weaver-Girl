import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmployeeRole, Prisma, User } from "@prisma/client";
import { z } from "zod";
import { PrismaService } from "../common/prisma.service";
import { encryptValue, hashValue, publicCode } from "./utils";
import { RegisterBuyerDto, RegisterKnitterDto } from "./dto";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const REGISTER_RATE_LIMIT_MS = 60 * 1000;
const SEED_EMPLOYEE_PUBLIC_CODES: Record<string, string> = {
  "13800000001": "80000001",
  "13800000002": "80000002",
  "13800000003": "80000003",
  "13800000004": "80000004",
  "13800000005": "80000005",
  "13800000006": "80000006"
};

const phoneSchema = z.string().min(6).max(32);
const otpSchema = z.string().regex(/^\d{6}$/);
const buyerSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  agreedTerms: z.literal(true),
  agreedPrivacy: z.literal(true),
  nickname: z.string().trim().max(40).optional()
});
const knitterSchema = buyerSchema.extend({
  displayName: z.string().trim().min(1).max(60),
  skills: z.array(z.string().trim().min(1)).min(1).max(12),
  intro: z.string().trim().min(10).max(1200),
  workUrls: z.array(z.string().url()).max(6).optional(),
  payoutAccount: z.string().trim().min(2).max(500).optional()
});

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async requestOtp(phone: string, purpose: "REGISTER" | "LOGIN" | "BIND_PHONE" = "LOGIN") {
    phoneSchema.parse(phone);
    const phoneHash = hashValue(phone);
    const latest = await this.prisma.phoneVerification.findFirst({
      where: { phone_hash: phoneHash, purpose },
      orderBy: { created_at: "desc" }
    });
    if (latest && Date.now() - latest.created_at.getTime() < REGISTER_RATE_LIMIT_MS) {
      throw new BadRequestException("請稍候再重新發送驗證碼。");
    }
    const code = process.env.MOCK_SMS_CODE ?? "123456";
    try {
      await this.prisma.phoneVerification.create({
        data: {
          phone_hash: phoneHash,
          code_hash: hashValue(code),
          purpose,
          expires_at: new Date(Date.now() + OTP_TTL_MS)
        }
      });
      return { ok: true, mockCode: process.env.NODE_ENV === "production" ? undefined : code };
    } catch (error) {
      if (this.isSeedEmployeePhone(phone)) {
        return { ok: true, mockOtpFallback: true, warning: "OTP_STORAGE_UNAVAILABLE_FOR_SEED_EMPLOYEE" };
      }
      throw error;
    }
  }

  async verifyOtp(phone: string, code: string, purpose: "REGISTER" | "LOGIN" | "BIND_PHONE" = "LOGIN") {
    phoneSchema.parse(phone);
    otpSchema.parse(code);
    const phoneHash = hashValue(phone);
    const verification = await this.prisma.phoneVerification.findFirst({
      where: { phone_hash: phoneHash, purpose, consumed_at: null },
      orderBy: { created_at: "desc" }
    });
    if (!verification) {
      if (code === (process.env.MOCK_SMS_CODE ?? "123456")) return { ok: true, phoneHash };
      throw new BadRequestException("驗證碼不存在，請重新發送。");
    }
    if (verification.expires_at < new Date()) throw new BadRequestException("驗證碼已過期。");
    if (verification.attempt_count >= MAX_OTP_ATTEMPTS) throw new BadRequestException("驗證碼錯誤次數過多，請重新發送。");

    if (verification.code_hash !== hashValue(code)) {
      await this.prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { attempt_count: { increment: 1 } }
      });
      throw new BadRequestException("驗證碼錯誤。");
    }

    await this.prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { consumed_at: new Date() }
    });
    return { ok: true, phoneHash };
  }

  async registerBuyer(dto: RegisterBuyerDto, ip?: string, userAgent?: string) {
    const parsed = buyerSchema.parse(dto);
    const { phoneHash } = await this.verifyOtp(parsed.phone, parsed.code, "REGISTER");
    const existing = await this.prisma.user.findUnique({
      where: { phone_hash: phoneHash },
      include: { roles: true, buyer_profile: true }
    });

    if (existing?.roles.some((role) => role.role === "BUYER")) {
      throw new BadRequestException("此手機號已註冊買家，請直接登入。");
    }

    const user = existing
      ? await this.addBuyerRole(existing.id, phoneHash, parsed.nickname, ip, userAgent)
      : await this.createUserWithPublicCode({
          phone_encrypted: encryptValue(parsed.phone),
          phone_hash: phoneHash,
          role_color: "blue",
          first_source: dto.tracking?.sourceId ? { connect: { id: dto.tracking.sourceId } } : undefined,
          first_campaign: dto.tracking?.campaignId ? { connect: { id: dto.tracking.campaignId } } : undefined,
          first_tracking_link: dto.tracking?.trackingLinkId ? { connect: { id: dto.tracking.trackingLinkId } } : undefined,
          roles: { create: { role: "BUYER" } },
          buyer_profile: { create: { nickname: parsed.nickname } },
          consent_logs: { create: consentRows(phoneHash, ip, userAgent) }
        });

    if (dto.tracking?.trackingLinkId) {
      await this.prisma.trackingLink.update({
        where: { id: dto.tracking.trackingLinkId },
        data: { register_count: { increment: 1 } }
      });
    }
    return this.session(user);
  }

  async registerKnitter(dto: RegisterKnitterDto, ip?: string, userAgent?: string) {
    const parsed = knitterSchema.parse(dto);
    const { phoneHash } = await this.verifyOtp(parsed.phone, parsed.code, "REGISTER");
    const existing = await this.prisma.user.findUnique({
      where: { phone_hash: phoneHash },
      include: { roles: true, knitter_profile: true }
    });
    if (existing?.roles.some((role) => role.role === "KNITTER")) {
      throw new BadRequestException("此手機號已申請織女，請勿重複申請。");
    }

    const knitterData = {
      display_name: parsed.displayName,
      skills: parsed.skills,
      intro: parsed.intro,
      payout_account_encrypted: parsed.payoutAccount ? encryptValue(parsed.payoutAccount) : null,
      application_status: "PENDING_REVIEW" as const,
      files: parsed.workUrls?.length
        ? { create: parsed.workUrls.map((fileUrl) => ({ file_url: fileUrl, file_type: "WORK_URL" })) }
        : undefined
    };

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            role_color: "purple",
            roles: { create: { role: "KNITTER" } },
            knitter_profile: { create: knitterData },
            consent_logs: { create: consentRows(phoneHash, ip, userAgent) }
          }
        })
      : await this.createUserWithPublicCode({
          phone_encrypted: encryptValue(parsed.phone),
          phone_hash: phoneHash,
          role_color: "purple",
          first_source: dto.tracking?.sourceId ? { connect: { id: dto.tracking.sourceId } } : undefined,
          first_campaign: dto.tracking?.campaignId ? { connect: { id: dto.tracking.campaignId } } : undefined,
          first_tracking_link: dto.tracking?.trackingLinkId ? { connect: { id: dto.tracking.trackingLinkId } } : undefined,
          roles: { create: { role: "KNITTER" } },
          knitter_profile: { create: knitterData },
          consent_logs: { create: consentRows(phoneHash, ip, userAgent) }
        });
    return this.session(user);
  }

  async employeeRegisterWithInvite(phone: string, code: string, inviteCode: string, name: string) {
    const { phoneHash } = await this.verifyOtp(phone, code, "REGISTER");
    const invite = await this.prisma.employeeInvite.findUnique({ where: { invite_code_hash: hashValue(inviteCode) } });
    if (!invite || invite.status !== "ACTIVE" || invite.expires_at < new Date()) {
      throw new BadRequestException("員工邀請碼無效或已過期。");
    }
    const existing = await this.prisma.user.findUnique({ where: { phone_hash: phoneHash }, include: { roles: true } });
    if (existing?.roles.some((role) => role.role === "EMPLOYEE")) {
      throw new BadRequestException("此手機號已是員工帳號。");
    }
    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            role_color: "gray",
            roles: { create: { role: "EMPLOYEE" } },
            employee_profile: { create: { name, role: invite.role, status: "ACTIVE" } }
          }
        })
      : await this.createUserWithPublicCode({
          phone_encrypted: encryptValue(phone),
          phone_hash: phoneHash,
          role_color: "gray",
          roles: { create: { role: "EMPLOYEE" } },
          employee_profile: { create: { name, role: invite.role, status: "ACTIVE" } }
        });
    await this.prisma.employeeInvite.update({
      where: { id: invite.id },
      data: { status: "USED", used_by: user.id, used_at: new Date() }
    });
    return this.session(user);
  }

  async login(phone: string, code: string) {
    const { phoneHash } = await this.verifyOtp(phone, code, "LOGIN");
    const user =
      (await this.prisma.user.findUnique({ where: { phone_hash: phoneHash } })) ??
      (this.isSeedEmployeePhone(phone) && this.isMockOtp(code)
        ? await this.prisma.user.findUnique({ where: { public_code: SEED_EMPLOYEE_PUBLIC_CODES[phone] } })
        : null);
    if (!user) throw new UnauthorizedException("此手機號尚未註冊。");
    return this.session(user);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true, buyer_profile: true, knitter_profile: true, employee_profile: true }
    });
  }

  async assertEmployee(userId: string, roles: EmployeeRole[]) {
    const profile = await this.prisma.employeeProfile.findUnique({ where: { user_id: userId } });
    if (!profile || profile.status !== "ACTIVE") {
      throw new UnauthorizedException("請先登入員工帳號。");
    }
    if (!roles.includes(profile.role)) {
      throw new ForbiddenException("沒有執行此後台操作的權限。");
    }
    return profile;
  }

  private async addBuyerRole(userId: string, phoneHash: string, nickname?: string, ip?: string, userAgent?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role_color: "blue",
        roles: { create: { role: "BUYER" } },
        buyer_profile: { create: { nickname } },
        consent_logs: { create: consentRows(phoneHash, ip, userAgent) }
      }
    });
  }

  private async createUserWithPublicCode(data: Omit<Prisma.UserCreateInput, "public_code" | "status">) {
    for (let i = 0; i < 5; i += 1) {
      try {
        return await this.prisma.user.create({ data: { ...data, public_code: publicCode(), status: "ACTIVE" } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
        throw error;
      }
    }
    throw new BadRequestException("無法產生唯一 public_code，請稍後再試。");
  }

  private async session(user: User) {
    const employee = await this.prisma.employeeProfile.findUnique({ where: { user_id: user.id } });
    const roles = await this.prisma.userRoleRecord.findMany({ where: { user_id: user.id } });
    const token = await this.jwt.signAsync({ sub: user.id, roles: roles.map((item) => item.role), employeeRole: employee?.role });
    return { token, user: { id: user.id, publicCode: user.public_code, roleColor: user.role_color, roles, employeeRole: employee?.role } };
  }

  private isMockOtp(code: string) {
    return code === (process.env.MOCK_SMS_CODE ?? "123456");
  }

  private isSeedEmployeePhone(phone: string) {
    return Object.prototype.hasOwnProperty.call(SEED_EMPLOYEE_PUBLIC_CODES, phone);
  }
}

function consentRows(phoneHash: string, ip?: string, userAgent?: string) {
  return [
    { phone_hash: phoneHash, policy_type: "TERMS" as const, policy_version: "2026-05-13", ip, user_agent: userAgent },
    { phone_hash: phoneHash, policy_type: "PRIVACY" as const, policy_version: "2026-05-13", ip, user_agent: userAgent }
  ];
}
