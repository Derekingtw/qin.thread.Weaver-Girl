import { BadRequestException, Body, Controller, Get, Headers, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import { CONTACT_INFO_ERROR, hasContactInfo } from "@knit/shared";
import { PrismaService } from "../common/prisma.service";
import { AuthService } from "./auth.service";
import { BusinessService } from "./business.service";
import { PaymentService } from "./payment.service";
import {
  CreateListingDto,
  CreateOrderDto,
  LoginDto,
  PhoneDto,
  RegisterBuyerDto,
  RegisterKnitterDto,
  SupportMessageDto,
  VerifyOtpDto
} from "./dto";
import { hashValue } from "./utils";

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly business: BusinessService,
    private readonly payments: PaymentService,
    private readonly jwt: JwtService
  ) {}

  @Post("auth/request-otp")
  requestOtp(@Body() dto: PhoneDto) {
    return this.auth.requestOtp(dto.phone, dto.purpose ?? "LOGIN");
  }

  @Post("auth/verify-otp")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.code, dto.purpose ?? "LOGIN");
  }

  @Post("auth/register-buyer")
  registerBuyer(@Body() dto: RegisterBuyerDto, @Req() req: Request) {
    return this.auth.registerBuyer(dto, req.ip, req.headers["user-agent"]);
  }

  @Post("auth/register-knitter")
  registerKnitter(@Body() dto: RegisterKnitterDto, @Req() req: Request) {
    return this.auth.registerKnitter(dto, req.ip, req.headers["user-agent"]);
  }

  @Post("auth/employee-register-with-invite")
  employeeRegister(@Body() dto: { phone: string; code: string; inviteCode: string; name: string }) {
    return this.auth.employeeRegisterWithInvite(dto.phone, dto.code, dto.inviteCode, dto.name);
  }

  @Post("auth/login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.phone, dto.code);
  }

  @Post("auth/logout")
  logout() {
    return { ok: true };
  }

  @Get("auth/me")
  me(@Headers() headers: Record<string, string>) {
    return this.auth.me(this.userId(headers));
  }

  @Post("user/preferred-locale")
  preferredLocale(@Headers() headers: Record<string, string>, @Body() dto: { locale: "zh-Hant" | "zh-Hans" | "en" }) {
    const userId = this.optionalUserId(headers);
    if (!["zh-Hant", "zh-Hans", "en"].includes(dto.locale)) throw new BadRequestException("Unsupported locale");
    if (!userId) return { ok: true, locale: dto.locale };
    return this.prisma.user.update({ where: { id: userId }, data: { preferred_locale: dto.locale }, select: { id: true, preferred_locale: true } });
  }

  @Post("user/preferred-style")
  preferredStyle(@Headers() headers: Record<string, string>, @Body() dto: { style: "fashion" | "cozy" | "chinese" }) {
    const userId = this.optionalUserId(headers);
    if (!["fashion", "cozy", "chinese"].includes(dto.style)) throw new BadRequestException("Unsupported style");
    if (!userId) return { ok: true, style: dto.style };
    return this.prisma.user.update({ where: { id: userId }, data: { preferred_style: dto.style }, select: { id: true, preferred_style: true } });
  }

  @Get("web/home")
  home(@Query("locale") locale?: string) {
    return this.business.home(locale);
  }

  @Get("web/announcements")
  webAnnouncements() {
    return this.business.announcements();
  }

  @Get("web/platform-products")
  webPlatformProducts() {
    return this.business.platformProducts();
  }

  @Get("web/listings")
  webListings() {
    return this.business.listings();
  }

  @Get("web/listings/:id")
  webListing(@Param("id") id: string) {
    return this.business.listing(id);
  }

  @Get("web/cms-pages/:slug")
  cmsPage(@Param("slug") slug: string) {
    return this.prisma.cmsPage.findUnique({ where: { slug } });
  }

  @Post("web/ad-placements/:id/impression")
  adImpression(@Param("id") id: string, @Req() req: Request, @Headers() headers: Record<string, string>) {
    return this.prisma.adEvent.create({ data: { ad_placement_id: id, event_type: "IMPRESSION", user_id: this.optionalUserId(headers), ip: req.ip, user_agent: req.headers["user-agent"] } });
  }

  @Post("web/ad-placements/:id/click")
  adClick(@Param("id") id: string, @Req() req: Request, @Headers() headers: Record<string, string>) {
    return this.prisma.adEvent.create({ data: { ad_placement_id: id, event_type: "CLICK", user_id: this.optionalUserId(headers), ip: req.ip, user_agent: req.headers["user-agent"] } });
  }

  @Get("r/:code")
  async redirect(@Param("code") code: string, @Req() req: Request, @Res() res: Response) {
    const link = await this.business.trackingRedirect(code, req.path, req.ip, req.headers["user-agent"]);
    const context = JSON.stringify({ sourceId: link.source_id, campaignId: link.campaign_id, trackingLinkId: link.id });
    res.cookie("knit_tracking", context, { httpOnly: false, sameSite: "lax", maxAge: 30 * 86400000 });
    res.redirect(link.target_url);
  }

  @Post("buyer/orders")
  createOrder(@Headers() headers: Record<string, string>, @Body() dto: CreateOrderDto) {
    return this.business.createOrder(this.userId(headers), dto);
  }

  @Get("buyer/orders")
  buyerOrders(@Headers() headers: Record<string, string>) {
    return this.business.buyerOrders(this.userId(headers));
  }

  @Post("buyer/orders/:id/pay-deposit")
  payDeposit(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    return this.payments.pay(id, this.userId(headers), "DEPOSIT");
  }

  @Post("buyer/orders/:id/pay-balance")
  payBalance(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    return this.payments.pay(id, this.userId(headers), "BALANCE");
  }

  @Post("buyer/support-tickets")
  buyerTicket(@Headers() headers: Record<string, string>, @Body() dto: { orderId?: string; messageText?: string }) {
    return this.business.createSupportTicket(this.userId(headers), "BUYER_PLATFORM", dto.orderId, dto.messageText);
  }

  @Post("buyer/support-tickets/:id/messages")
  buyerTicketMessage(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: SupportMessageDto) {
    return this.prisma.supportMessage.create({ data: { ticket_id: id, sender_user_id: this.userId(headers), visibility: "BUYER_PLATFORM", message_text: dto.messageText } });
  }

  @Get("knitter/application-status")
  knitterApplicationStatus(@Headers() headers: Record<string, string>) {
    return this.prisma.knitterProfile.findUnique({ where: { user_id: this.userId(headers) }, select: { application_status: true, reject_reason: true } });
  }

  @Post("knitter/listings")
  createListing(@Headers() headers: Record<string, string>, @Body() dto: CreateListingDto) {
    return this.business.createListing(this.userId(headers), dto);
  }

  @Get("knitter/ad-packages")
  adPackages() {
    return this.prisma.adPackage.findMany({ where: { status: "ACTIVE" }, orderBy: { sort_order: "asc" } });
  }

  @Post("knitter/ad-applications")
  async createAdApplication(@Headers() headers: Record<string, string>, @Body() dto: { listingId: string; packageId: string; titleZhHant: string; subtitleZhHant?: string; imageUrl?: string; requestedStartAt?: string; preferredSlotIndex?: number }) {
    const knitterId = this.userId(headers);
    const profile = await this.prisma.knitterProfile.findUnique({ where: { user_id: knitterId } });
    if (!profile || profile.application_status !== "APPROVED") throw new BadRequestException("只有審核通過的織女可以申請推廣。");
    const listing = await this.prisma.listing.findFirst({ where: { id: dto.listingId, created_by_user_id: knitterId, status: "LIVE", deleted_at: null } });
    if (!listing) throw new BadRequestException("只能使用自己的 LIVE 作品申請推廣。");
    if (hasContactInfo(dto.titleZhHant) || hasContactInfo(dto.subtitleZhHant ?? "") || hasContactInfo(listing.description)) throw new BadRequestException(CONTACT_INFO_ERROR);
    return this.prisma.adApplication.create({
      data: {
        knitter_id: knitterId,
        listing_id: listing.id,
        package_id: dto.packageId,
        ad_title_zh_hant: dto.titleZhHant,
        ad_subtitle_zh_hant: dto.subtitleZhHant,
        ad_image_url: dto.imageUrl,
        requested_start_at: dto.requestedStartAt ? new Date(dto.requestedStartAt) : null,
        preferred_slot_index: dto.preferredSlotIndex,
        status: "SUBMITTED"
      }
    });
  }

  @Post("knitter/ad-applications/:id/pay")
  payAd(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    return this.payments.payAdFee(id, this.userId(headers));
  }

  @Post("admin/employee-invites")
  async employeeInvite(@Headers() headers: Record<string, string>, @Body() dto: { inviteCode: string; role: string; expiresAt: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN"]);
    return this.prisma.employeeInvite.create({
      data: { invite_code_hash: hashValue(dto.inviteCode), role: dto.role as never, created_by: actorId, expires_at: new Date(dto.expiresAt) }
    });
  }

  @Get("admin/homepage-settings")
  async adminHomepageSettings(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "CUSTOMER_SERVICE", "OPS", "REVIEWER"]);
    return this.prisma.homepageSetting.findFirst({ orderBy: { updated_at: "desc" } });
  }

  @Patch("admin/homepage-settings")
  async patchHomepageSettings(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const current = await this.prisma.homepageSetting.findFirst({ orderBy: { updated_at: "desc" } });
    const data = { ...dto, updated_by: actorId } as never;
    const next = current
      ? await this.prisma.homepageSetting.update({ where: { id: current.id }, data })
      : await this.prisma.homepageSetting.create({ data });
    await this.prisma.auditLog.create({ data: { actor_user_id: actorId, action: "UPDATE_HOMEPAGE_SETTINGS", entity_type: "homepage_settings", entity_id: next.id, before: current as never, after: next as never } });
    return next;
  }

  @Get("admin/announcements")
  adminAnnouncements() {
    return this.prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { sort_order: "asc" }] });
  }

  @Post("admin/announcements")
  async createAnnouncement(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const data = { ...dto, created_by: actorId } as never;
    return this.prisma.announcement.create({ data });
  }

  @Patch("admin/announcements/:id")
  async patchAnnouncement(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const data = { ...dto, updated_by: actorId } as never;
    return this.prisma.announcement.update({ where: { id }, data });
  }

  @Post("admin/platform-products")
  async platformProduct(@Headers() headers: Record<string, string>, @Body() dto: CreateListingDto) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "OPS"]);
    const listing = await this.prisma.listing.create({
      data: {
        created_by_user_id: actorId,
        listing_type: "PLATFORM_PRODUCT",
        cooperation_mode: "PLATFORM_OWNED_INVENTORY",
        title: dto.title,
        description: dto.description,
        price_cents: dto.priceCents,
        payment_mode: "FULL_PAYMENT",
        status: "LIVE",
        publish_channel: "ADMIN",
        images: dto.imageUrls?.length ? { create: dto.imageUrls.map((imageUrl, index) => ({ image_url: imageUrl, sort_order: index + 1 })) } : undefined
      }
    });
    await this.prisma.auditLog.create({ data: { actor_user_id: actorId, action: "CREATE_PLATFORM_PRODUCT", entity_type: "listings", entity_id: listing.id, after: listing as never } });
    return listing;
  }

  @Get("admin/media-assets")
  async mediaAssets(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "OPS", "REVIEWER"]);
    return this.prisma.mediaAsset.findMany({ orderBy: { created_at: "desc" } });
  }

  @Post("admin/media-assets")
  async createMediaAsset(@Headers() headers: Record<string, string>, @Body() dto: { url: string; usage?: string; originalName?: string; mimeType?: string; sizeBytes?: number }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "OPS"]);
    return this.prisma.mediaAsset.create({
      data: {
        url: dto.url,
        usage: (dto.usage ?? "OTHER") as never,
        asset_type: "IMAGE",
        original_name: dto.originalName,
        mime_type: dto.mimeType,
        size_bytes: dto.sizeBytes,
        created_by: actorId
      }
    });
  }

  @Get("admin/knitter-applications")
  adminKnitterApps() {
    return this.prisma.knitterProfile.findMany({ where: { application_status: "PENDING_REVIEW" }, include: { files: true, user: true } });
  }

  @Post("admin/knitter-applications/:id/approve")
  approveKnitter(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    return this.prisma.knitterProfile.update({ where: { id }, data: { application_status: "APPROVED", approved_by: this.userId(headers), approved_at: new Date() } });
  }

  @Post("admin/knitter-applications/:id/reject")
  rejectKnitter(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: { reason: string }) {
    return this.prisma.knitterProfile.update({ where: { id }, data: { application_status: "REJECTED", reject_reason: dto.reason, approved_by: this.userId(headers) } });
  }

  @Get("admin/audit-logs")
  audit(@Headers() headers: Record<string, string>) {
    return this.business.audit(this.userId(headers));
  }

  private userId(headers: Record<string, string>) {
    const direct = headers["x-user-id"];
    if (direct) return direct;
    const authorization = headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
      const payload = this.jwt.verify<{ sub: string }>(authorization.slice(7), { secret: process.env.JWT_SECRET ?? "dev_jwt_secret_change_me" });
      return payload.sub;
    }
    throw new Error("Missing x-user-id or Bearer token");
  }

  private optionalUserId(headers: Record<string, string>) {
    try {
      return this.userId(headers);
    } catch {
      return undefined;
    }
  }
}
