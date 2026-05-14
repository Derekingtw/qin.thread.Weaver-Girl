import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import type { Request, Response } from "express";
import { CONTACT_INFO_ERROR, hasContactInfo } from "@knit/shared";
import { PrismaService } from "../common/prisma.service";
import { AuthService } from "./auth.service";
import { BusinessService } from "./business.service";
import { PaymentService } from "./payment.service";
import { ObjectStorageService } from "./object-storage.provider";
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

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const HOMEPAGE_FIELDS = [
  "hero_badge_zh_hant", "hero_badge_zh_hans", "hero_badge_en",
  "hero_slogan_zh_hant", "hero_slogan_zh_hans", "hero_slogan_en",
  "hero_subtitle_zh_hant", "hero_subtitle_zh_hans", "hero_subtitle_en",
  "primary_cta_text_zh_hant", "primary_cta_text_zh_hans", "primary_cta_text_en", "primary_cta_url",
  "secondary_cta_text_zh_hant", "secondary_cta_text_zh_hans", "secondary_cta_text_en", "secondary_cta_url",
  "hero_image_url", "hero_image_asset_id", "hero_image_alt_zh_hant", "hero_image_alt_zh_hans", "hero_image_alt_en",
  "hero_image_position", "hero_image_mobile_position", "show_hero_stat_card",
  "hero_stat_label_zh_hant", "hero_stat_label_zh_hans", "hero_stat_label_en", "hero_stat_value",
  "hero_stat_extra_zh_hant", "hero_stat_extra_zh_hans", "hero_stat_extra_en",
  "trust_point_1_zh_hant", "trust_point_1_zh_hans", "trust_point_1_en",
  "trust_point_2_zh_hant", "trust_point_2_zh_hans", "trust_point_2_en",
  "trust_point_3_zh_hant", "trust_point_3_zh_hans", "trust_point_3_en",
  "default_style", "allow_style_switch", "enabled_styles"
];

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly business: BusinessService,
    private readonly payments: PaymentService,
    private readonly storage: ObjectStorageService,
    private readonly jwt: JwtService
  ) {}

  @Get("health")
  async health() {
    let database: "ok" | "error" = "ok";
    let redis: "ok" | "error" | "not_configured" = process.env.REDIS_URL ? "ok" : "not_configured";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "error";
    }
    if (process.env.REDIS_URL) {
      const client = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 0, connectTimeout: 1500 });
      try {
        await client.connect();
        await client.ping();
      } catch {
        redis = "error";
      } finally {
        client.disconnect();
      }
    }
    return { status: database === "ok" ? "ok" : "degraded", service: "qinshixian-api", time: new Date().toISOString(), database, redis, storage: this.storage.providerName() };
  }

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
    if (!profile || profile.application_status !== "APPROVED") throw new BadRequestException("織女審核通過後才可申請推廣。");
    const listing = await this.prisma.listing.findFirst({ where: { id: dto.listingId, created_by_user_id: knitterId, status: "LIVE", deleted_at: null } });
    if (!listing) throw new BadRequestException("僅 LIVE 作品可申請推廣。");
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

  @Get("admin/dashboard")
  async adminDashboard(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "REVIEWER", "OPS", "FINANCE", "CUSTOMER_SERVICE"]);
    const [users, pendingKnitters, pendingListings, orders, tickets, payments, storageAssets] = await Promise.all([
      this.prisma.user.count({ where: { deleted_at: null } }),
      this.prisma.knitterProfile.count({ where: { application_status: "PENDING_REVIEW" } }),
      this.prisma.listing.count({ where: { status: "PENDING_REVIEW", deleted_at: null } }),
      this.prisma.order.count({ where: { deleted_at: null } }),
      this.prisma.supportTicket.count({ where: { status: { in: ["OPEN", "PENDING"] } } }),
      this.prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount_cents: true } }),
      this.prisma.mediaAsset.count({ where: { deleted_at: null } })
    ]);
    return {
      metrics: { users, pendingKnitters, pendingListings, orders, openTickets: tickets, paidAmountCents: payments._sum.amount_cents ?? 0, mediaAssets: storageAssets },
      todo: { pendingKnitters, pendingListings, openTickets: tickets },
      health: await this.health()
    };
  }

  @Get("admin/homepage-settings")
  async adminHomepageSettings(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "CUSTOMER_SERVICE", "OPS", "REVIEWER"]);
    return this.homepageSetting();
  }

  @Patch("admin/homepage-settings")
  async patchHomepageSettings(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    if (dto.hero_image_asset_id) {
      const asset = await this.prisma.mediaAsset.findFirst({ where: { id: String(dto.hero_image_asset_id), deleted_at: null } });
      if (!asset) throw new BadRequestException("指定的 Hero 圖片素材不存在。");
      dto.hero_image_url = dto.hero_image_url || asset.url;
    }
    const current = await this.prisma.homepageSetting.findFirst({ orderBy: { updated_at: "desc" } });
    const data = pick(dto, HOMEPAGE_FIELDS) as Record<string, unknown>;
    data.updated_by = actorId;
    const next = current
      ? await this.prisma.homepageSetting.update({ where: { id: current.id }, data: data as never })
      : await this.prisma.homepageSetting.create({ data: withHomepageDefaults(data, actorId) as never });
    await this.auditLog(actorId, "UPDATE_HOMEPAGE_SETTINGS", "homepage_settings", next.id, current, next);
    return next;
  }

  @Get("admin/media-assets")
  async mediaAssets(@Headers() headers: Record<string, string>, @Query("usage") usage?: string) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "OPS", "REVIEWER"]);
    return this.prisma.mediaAsset.findMany({ where: { deleted_at: null, ...(usage ? { usage: usage as never } : {}) }, orderBy: { created_at: "desc" } });
  }

  @Post("admin/media-assets")
  async createMediaAsset(@Headers() headers: Record<string, string>, @Body() dto: { url: string; usage?: string; originalName?: string; mimeType?: string; sizeBytes?: number; width?: number; height?: number }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "OPS"]);
    const asset = await this.prisma.mediaAsset.create({
      data: {
        url: dto.url,
        usage: (dto.usage ?? "OTHER") as never,
        asset_type: "IMAGE",
        original_name: dto.originalName,
        mime_type: dto.mimeType,
        size_bytes: dto.sizeBytes,
        width: dto.width,
        height: dto.height,
        storage_provider: "MOCK",
        created_by: actorId
      }
    });
    await this.auditLog(actorId, "CREATE_MEDIA_ASSET", "media_assets", asset.id, null, asset);
    return asset;
  }

  @Post("admin/media/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(@Headers() headers: Record<string, string>, @UploadedFile() file: any, @Body() dto: { usage?: string }) {
    const actorId = this.userId(headers);
    const usage = dto.usage ?? "OTHER";
    const roles = usage === "HOME_HERO" || usage === "LOGO" ? ["SUPER_ADMIN", "MARKETING"] as const : ["SUPER_ADMIN", "MARKETING", "OPS"] as const;
    await this.auth.assertEmployee(actorId, [...roles]);
    if (!file) throw new BadRequestException("請選擇要上傳的圖片。");
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) throw new BadRequestException("圖片格式僅支援 JPG、PNG、WEBP。");
    const maxBytes = Number(process.env.MEDIA_MAX_SIZE_MB ?? 5) * 1024 * 1024;
    if (file.size > maxBytes) throw new BadRequestException(`圖片不可超過 ${process.env.MEDIA_MAX_SIZE_MB ?? 5}MB。`);
    const dimensions = imageDimensions(file.buffer, file.mimetype);
    const safeName = safeFileName(file.originalname || "upload");
    const key = `${usage.toLowerCase()}/${Date.now()}-${safeName}`;
    const stored = await this.storage.upload({ key, body: file.buffer, contentType: file.mimetype });
    const asset = await this.prisma.mediaAsset.create({
      data: {
        url: stored.url,
        asset_type: "IMAGE",
        original_name: file.originalname,
        mime_type: file.mimetype,
        size_bytes: file.size,
        width: dimensions.width,
        height: dimensions.height,
        usage: usage as never,
        storage_provider: stored.provider,
        storage_key: stored.key,
        created_by: actorId
      }
    });
    await this.auditLog(actorId, "UPLOAD_MEDIA_ASSET", "media_assets", asset.id, null, { ...asset, warning: stored.warning });
    return { ...asset, warning: stored.warning };
  }

  @Delete("admin/media-assets/:id")
  async deleteMedia(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const asset = await this.prisma.mediaAsset.update({ where: { id }, data: { deleted_at: new Date() } });
    await this.auditLog(actorId, "DELETE_MEDIA_ASSET", "media_assets", id, asset, { deleted_at: asset.deleted_at });
    return { ok: true };
  }

  @Get("admin/announcements")
  async adminAnnouncements(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "CUSTOMER_SERVICE", "OPS", "REVIEWER"]);
    return this.prisma.announcement.findMany({ where: { deleted_at: null }, orderBy: [{ pinned: "desc" }, { sort_order: "asc" }, { created_at: "desc" }] });
  }

  @Post("admin/announcements")
  async createAnnouncement(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const item = await this.prisma.announcement.create({ data: normalizeAnnouncement(dto, actorId) as never });
    await this.auditLog(actorId, "CREATE_ANNOUNCEMENT", "announcements", item.id, null, item);
    return item;
  }

  @Patch("admin/announcements/:id")
  async patchAnnouncement(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const before = await this.prisma.announcement.findUnique({ where: { id } });
    const item = await this.prisma.announcement.update({ where: { id }, data: normalizeAnnouncement(dto, actorId, true) as never });
    await this.auditLog(actorId, "UPDATE_ANNOUNCEMENT", "announcements", item.id, before, item);
    return item;
  }

  @Get("admin/platform-products")
  async adminPlatformProducts(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "OPS", "CUSTOMER_SERVICE"]);
    return this.prisma.listing.findMany({ where: { listing_type: "PLATFORM_PRODUCT", deleted_at: null }, include: { images: true }, orderBy: [{ sort_order: "asc" }, { created_at: "desc" }] });
  }

  @Post("admin/platform-products")
  async createPlatformProduct(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "OPS"]);
    const listing = await this.prisma.listing.create({ data: productData(dto, actorId) as never, include: { images: true } });
    await this.auditLog(actorId, "CREATE_PLATFORM_PRODUCT", "listings", listing.id, null, listing);
    return listing;
  }

  @Patch("admin/platform-products/:id")
  async patchPlatformProduct(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "OPS"]);
    const before = await this.prisma.listing.findUnique({ where: { id }, include: { images: true } });
    const listing = await this.prisma.listing.update({ where: { id }, data: productUpdateData(dto) as never, include: { images: true } });
    await this.auditLog(actorId, "UPDATE_PLATFORM_PRODUCT", "listings", listing.id, before, listing);
    return listing;
  }

  @Get("admin/knitter-applications")
  async adminKnitterApps(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "REVIEWER", "CUSTOMER_SERVICE"]);
    return this.prisma.knitterProfile.findMany({ where: { application_status: "PENDING_REVIEW" }, include: { files: true, user: true } });
  }

  @Post("admin/knitter-applications/:id/approve")
  async approveKnitter(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "REVIEWER"]);
    const item = await this.prisma.knitterProfile.update({ where: { id }, data: { application_status: "APPROVED", approved_by: actorId, approved_at: new Date() } });
    await this.auditLog(actorId, "APPROVE_KNITTER", "knitter_profiles", id, null, item);
    return item;
  }

  @Post("admin/knitter-applications/:id/reject")
  async rejectKnitter(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: { reason: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "REVIEWER"]);
    const item = await this.prisma.knitterProfile.update({ where: { id }, data: { application_status: "REJECTED", reject_reason: dto.reason, approved_by: actorId } });
    await this.auditLog(actorId, "REJECT_KNITTER", "knitter_profiles", id, null, item);
    return item;
  }

  @Get("admin/listings")
  async adminListings(@Headers() headers: Record<string, string>, @Query("status") status?: string) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "REVIEWER", "OPS", "MARKETING", "CUSTOMER_SERVICE"]);
    return this.prisma.listing.findMany({ where: { deleted_at: null, ...(status ? { status: status as never } : {}) }, include: { images: true, created_by: true }, orderBy: { created_at: "desc" } });
  }

  @Post("admin/listings/:id/approve")
  async approveListing(@Headers() headers: Record<string, string>, @Param("id") id: string) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "REVIEWER"]);
    return this.prisma.listing.update({ where: { id }, data: { status: "LIVE", reviewed_by: actorId, reviewed_at: new Date() } });
  }

  @Post("admin/listings/:id/reject")
  async rejectListing(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: { reason?: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "REVIEWER"]);
    return this.prisma.listing.update({ where: { id }, data: { status: "REJECTED", reject_reason: dto.reason, reviewed_by: actorId } });
  }

  @Get("admin/ad-packages")
  async adminAdPackages(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "REVIEWER"]);
    return this.prisma.adPackage.findMany({ orderBy: { sort_order: "asc" } });
  }

  @Post("admin/ad-packages")
  async createAdPackage(@Headers() headers: Record<string, string>, @Body() dto: Record<string, unknown>) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    const item = await this.prisma.adPackage.create({ data: { name_zh_hant: String(dto.name_zh_hant || dto.name || "新推廣方案"), duration_days: Number(dto.duration_days || 7), price_cents: Number(dto.price_cents || 0), sort_order: Number(dto.sort_order || 0) } });
    await this.auditLog(actorId, "CREATE_AD_PACKAGE", "ad_packages", item.id, null, item);
    return item;
  }

  @Get("admin/ad-applications")
  async adminAdApplications(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "MARKETING", "REVIEWER"]);
    return this.prisma.adApplication.findMany({ where: { deleted_at: null }, include: { listing: true, package: true, payments: true, placements: { include: { slot: true } } }, orderBy: { created_at: "desc" } });
  }

  @Post("admin/ad-applications/:id/approve")
  async approveAd(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: { slotIndex?: number; startsAt?: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "REVIEWER"]);
    const application = await this.prisma.adApplication.update({ where: { id }, data: { status: "APPROVED_PENDING_PAYMENT", reviewed_by: actorId, reviewed_at: new Date() }, include: { package: true } });
    if (dto.slotIndex && dto.startsAt) {
      const slot = await this.prisma.adSlot.findFirst({ where: { slot_index: dto.slotIndex, placement: "HOME_KNITTER_PROMO" } });
      if (!slot) throw new BadRequestException("指定廣告位不存在。");
      const startsAt = new Date(dto.startsAt);
      const endsAt = new Date(startsAt.getTime() + application.package.duration_days * 86400000);
      const conflict = await this.prisma.adPlacement.findFirst({ where: { ad_slot_id: slot.id, status: { in: ["SCHEDULED", "LIVE"] }, starts_at: { lt: endsAt }, ends_at: { gt: startsAt } } });
      if (conflict) throw new BadRequestException("指定廣告位檔期衝突。");
      await this.prisma.adPlacement.create({ data: { ad_application_id: id, ad_slot_id: slot.id, starts_at: startsAt, ends_at: endsAt, status: "SCHEDULED", created_by: actorId } });
    }
    await this.auditLog(actorId, "APPROVE_AD_APPLICATION", "ad_applications", id, null, application);
    return application;
  }

  @Post("admin/ad-applications/:id/reject")
  async rejectAd(@Headers() headers: Record<string, string>, @Param("id") id: string, @Body() dto: { reason?: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING", "REVIEWER"]);
    return this.prisma.adApplication.update({ where: { id }, data: { status: "REJECTED", reject_reason: dto.reason, reviewed_by: actorId, reviewed_at: new Date() } });
  }

  @Get("admin/orders")
  async adminOrders(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "OPS", "FINANCE", "CUSTOMER_SERVICE"]);
    return this.prisma.order.findMany({ where: { deleted_at: null }, include: { listing: true, payments: true, status_logs: true }, orderBy: { created_at: "desc" }, take: 100 });
  }

  @Get("admin/support-tickets")
  async adminTickets(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "CUSTOMER_SERVICE", "OPS"]);
    return this.prisma.supportTicket.findMany({ include: { messages: true, order: true, created_by: true }, orderBy: { created_at: "desc" }, take: 100 });
  }

  @Get("admin/settlements")
  async adminSettlements(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "FINANCE"]);
    return this.prisma.settlement.findMany({ include: { order: true, knitter: true }, orderBy: { created_at: "desc" }, take: 100 });
  }

  @Get("admin/refunds")
  async adminRefunds(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "FINANCE", "CUSTOMER_SERVICE"]);
    return this.prisma.refund.findMany({ include: { order: true, payment: true }, orderBy: { created_at: "desc" }, take: 100 });
  }

  @Get("admin/users")
  async adminUsers(@Headers() headers: Record<string, string>, @Query("role") role?: string) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN", "CUSTOMER_SERVICE", "OPS", "REVIEWER"]);
    return this.prisma.user.findMany({ where: role ? { roles: { some: { role: role as never } } } : {}, include: { roles: true, buyer_profile: true, knitter_profile: true, employee_profile: true }, orderBy: { created_at: "desc" }, take: 100 });
  }

  @Post("admin/employee-invites")
  async employeeInvite(@Headers() headers: Record<string, string>, @Body() dto: { inviteCode: string; role: string; expiresAt: string }) {
    const actorId = this.userId(headers);
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN"]);
    return this.prisma.employeeInvite.create({
      data: { invite_code_hash: hashValue(dto.inviteCode), role: dto.role as never, created_by: actorId, expires_at: new Date(dto.expiresAt) }
    });
  }

  @Get("admin/employee-invites")
  async employeeInvites(@Headers() headers: Record<string, string>) {
    await this.auth.assertEmployee(this.userId(headers), ["SUPER_ADMIN"]);
    return this.prisma.employeeInvite.findMany({ orderBy: { expires_at: "desc" }, take: 100 });
  }

  @Get("admin/audit-logs")
  audit(@Headers() headers: Record<string, string>) {
    return this.business.audit(this.userId(headers));
  }

  private async homepageSetting() {
    const current = await this.prisma.homepageSetting.findFirst({ orderBy: { updated_at: "desc" } });
    if (current) return current;
    return {
      hero_badge_zh_hant: "平台交易・安心委託・溫柔陪伴",
      hero_slogan_zh_hant: "讓每一件手作，都被溫柔對待",
      hero_subtitle_zh_hant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
      primary_cta_text_zh_hant: "開始委託",
      primary_cta_url: "/works",
      secondary_cta_text_zh_hant: "探索作品",
      secondary_cta_url: "/works",
      hero_image_url: "/brand/hero-qinshixian-yarn.png",
      show_hero_stat_card: false
    };
  }

  private userId(headers: Record<string, string>) {
    const direct = headers["x-user-id"];
    if (direct) return direct;
    const authorization = headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
      try {
        const payload = this.jwt.verify<{ sub: string }>(authorization.slice(7), { secret: process.env.JWT_SECRET ?? "dev_jwt_secret_change_me" });
        return payload.sub;
      } catch {
        throw new UnauthorizedException("登入已過期，請重新登入。");
      }
    }
    throw new UnauthorizedException("Missing Bearer token");
  }

  private optionalUserId(headers: Record<string, string>) {
    try {
      return this.userId(headers);
    } catch {
      return undefined;
    }
  }

  private auditLog(actorId: string, action: string, entityType: string, entityId: string, before: unknown, after: unknown) {
    return this.prisma.auditLog.create({ data: { actor_user_id: actorId, action, entity_type: entityType, entity_id: entityId, before: before as never, after: after as never } });
  }
}

function pick(input: Record<string, unknown>, fields: string[]) {
  const output: Record<string, unknown> = {};
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) output[field] = input[field];
  }
  return output;
}

function withHomepageDefaults(data: Record<string, unknown>, actorId: string) {
  return {
    hero_badge_zh_hant: "平台交易・安心委託・溫柔陪伴",
    hero_slogan_zh_hant: "讓每一件手作，都被溫柔對待",
    hero_subtitle_zh_hant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
    primary_cta_text_zh_hant: "開始委託",
    primary_cta_url: "/works",
    secondary_cta_text_zh_hant: "探索作品",
    secondary_cta_url: "/works",
    show_hero_stat_card: false,
    updated_by: actorId,
    ...data
  };
}

function normalizeAnnouncement(input: Record<string, unknown>, actorId: string, update = false) {
  const data = pick(input, ["title_zh_hant", "title_zh_hans", "title_en", "summary_zh_hant", "summary_zh_hans", "summary_en", "content_zh_hant", "content_zh_hans", "content_en", "image_url", "link_url", "pinned", "sort_order", "status"]) as Record<string, unknown>;
  if (input.starts_at) data.starts_at = new Date(String(input.starts_at));
  if (input.ends_at) data.ends_at = new Date(String(input.ends_at));
  if (!update) data.created_by = actorId;
  data.updated_by = actorId;
  if (!data.title_zh_hant && !update) data.title_zh_hant = String(input.title || "新公告");
  return data;
}

function productData(input: Record<string, unknown>, actorId: string) {
  return {
    created_by_user_id: actorId,
    listing_type: "PLATFORM_PRODUCT",
    cooperation_mode: "PLATFORM_OWNED_INVENTORY",
    title: String(input.title || "新自營商品"),
    description: String(input.description || "秦時線自營選品"),
    price_cents: Number(input.price_cents || input.priceCents || 0),
    stock_quantity: Number(input.stock_quantity || 0),
    payment_mode: (input.payment_mode || "FULL_PAYMENT") as string,
    status: (input.status || "LIVE") as string,
    publish_channel: "ADMIN",
    sort_order: Number(input.sort_order || 0),
    is_platform_featured: Boolean(input.is_platform_featured ?? true),
    images: input.image_url ? { create: [{ image_url: String(input.image_url), sort_order: 1 }] } : undefined
  };
}

function productUpdateData(input: Record<string, unknown>) {
  return pick(input, ["title", "description", "price_cents", "stock_quantity", "payment_mode", "status", "sort_order", "is_platform_featured"]);
}

function safeFileName(name: string) {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-").replace(/-+/g, "-");
  return cleaned || "upload.png";
}

function imageDimensions(buffer: Buffer, mime: string) {
  if (mime === "image/png" && buffer.length >= 24) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (mime === "image/jpeg") {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  if (mime === "image/webp" && buffer.toString("ascii", 0, 4) === "RIFF") {
    const type = buffer.toString("ascii", 12, 16);
    if (type === "VP8X" && buffer.length >= 30) {
      return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    }
  }
  return { width: null, height: null };
}
