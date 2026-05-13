import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";
import { CONTACT_INFO_ERROR, calculateCommission, calculateDeposit, hasContactInfo } from "@knit/shared";
import { PrismaService } from "../common/prisma.service";
import { AuthService } from "./auth.service";
import { CreateListingDto, CreateOrderDto } from "./dto";
import { encryptValue, orderNo } from "./utils";

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService
  ) {}

  async home(locale = "zh-Hant") {
    const now = new Date();
    const [homepageSettings, announcements, hotCommissionListings, platformProducts, promotedKnitterAds] =
      await Promise.all([
        this.prisma.homepageSetting.findFirst({ orderBy: { updated_at: "desc" } }),
        this.prisma.announcement.findMany({
          where: {
            status: "PUBLISHED",
            deleted_at: null,
            OR: [{ starts_at: null }, { starts_at: { lte: now } }],
            AND: [{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }]
          },
          orderBy: [{ pinned: "desc" }, { sort_order: "asc" }, { created_at: "desc" }],
          take: 4
        }),
        this.prisma.listing.findMany({
          where: { status: "LIVE", deleted_at: null, listing_type: "KNITTER_SERVICE" },
          include: { images: true },
          orderBy: [{ is_platform_featured: "desc" }, { sort_order: "asc" }, { created_at: "desc" }],
          take: 8
        }),
        this.prisma.listing.findMany({
          where: { status: "LIVE", deleted_at: null, listing_type: "PLATFORM_PRODUCT" },
          include: { images: true },
          orderBy: [{ is_platform_featured: "desc" }, { sort_order: "asc" }, { created_at: "desc" }],
          take: 8
        }),
        this.prisma.adPlacement.findMany({
          where: {
            status: { in: ["LIVE", "SCHEDULED"] },
            starts_at: { lte: now },
            ends_at: { gte: now },
            slot: { placement: "HOME_KNITTER_PROMO", status: "ACTIVE" },
            application: { status: { in: ["LIVE", "PAID", "SCHEDULED"] }, deleted_at: null }
          },
          include: { slot: true, application: { include: { listing: { include: { images: true } }, package: true } } },
          orderBy: [{ slot: { slot_index: "asc" } }, { priority: "desc" }, { starts_at: "asc" }],
          take: 3
        })
      ]);
    return {
      locale,
      homepage_settings: homepageSettings,
      announcements,
      promoted_knitter_ads: promotedKnitterAds,
      hot_commission_listings: hotCommissionListings,
      platform_products: platformProducts,
      process_steps: ["支付訂金", "平台協調", "驗收作品", "支付尾款", "平台出貨"],
      cooperation_modes: ["COMMISSION_5", "PLATFORM_BUYOUT_SERVICE", "PLATFORM_OWNED_INVENTORY"]
    };
  }

  announcements() {
    const now = new Date();
    return this.prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
        deleted_at: null,
        OR: [{ starts_at: null }, { starts_at: { lte: now } }],
        AND: [{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }]
      },
      orderBy: [{ pinned: "desc" }, { sort_order: "asc" }, { created_at: "desc" }]
    });
  }

  platformProducts() {
    return this.prisma.listing.findMany({
      where: { listing_type: "PLATFORM_PRODUCT", status: "LIVE", deleted_at: null },
      include: { images: true },
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }]
    });
  }

  listings() {
    return this.prisma.listing.findMany({
      where: { status: "LIVE", deleted_at: null },
      include: { images: true },
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }]
    });
  }

  async listing(id: string) {
    const listing = await this.prisma.listing.findFirst({ where: { id, deleted_at: null }, include: { images: true } });
    if (!listing) throw new NotFoundException("作品不存在。");
    return listing;
  }

  async createListing(userId: string, dto: CreateListingDto) {
    const profile = await this.prisma.knitterProfile.findUnique({ where: { user_id: userId } });
    if (!profile || profile.application_status !== "APPROVED") {
      throw new UnauthorizedException("織女審核通過後才可以發布作品。");
    }
    if (hasContactInfo(dto.title) || hasContactInfo(dto.description)) throw new BadRequestException(CONTACT_INFO_ERROR);
    return this.prisma.listing.create({
      data: {
        created_by_user_id: userId,
        listing_type: "KNITTER_SERVICE",
        cooperation_mode: dto.cooperationMode ?? "COMMISSION_5",
        title: dto.title,
        description: dto.description,
        price_cents: dto.priceCents,
        delivery_days: dto.deliveryDays,
        labor_fee_cents: dto.laborFeeCents,
        payment_mode: "DEPOSIT_50",
        status: "PENDING_REVIEW",
        publish_channel: "H5",
        images: dto.imageUrls?.length
          ? { create: dto.imageUrls.map((imageUrl, index) => ({ image_url: imageUrl, sort_order: index + 1 })) }
          : undefined
      }
    });
  }

  async createOrder(buyerId: string, dto: CreateOrderDto) {
    const listing = await this.prisma.listing.findFirst({ where: { id: dto.listingId, status: "LIVE", deleted_at: null } });
    if (!listing) throw new BadRequestException("作品不可購買或不存在。");
    const amounts =
      listing.payment_mode === "FULL_PAYMENT"
        ? { depositAmountCents: listing.price_cents, balanceAmountCents: 0 }
        : calculateDeposit(listing.price_cents, Number(listing.deposit_rate));
    const order = await this.prisma.order.create({
      data: {
        order_no: orderNo(),
        buyer_id: buyerId,
        listing_id: listing.id,
        knitter_id: listing.listing_type === "KNITTER_SERVICE" ? listing.created_by_user_id : null,
        cooperation_mode_snapshot: listing.cooperation_mode,
        total_price_cents: listing.price_cents,
        deposit_amount_cents: amounts.depositAmountCents,
        balance_amount_cents: amounts.balanceAmountCents,
        currency: listing.currency,
        delivery_days_snapshot: listing.delivery_days,
        buyer_address_encrypted: dto.buyerAddress ? encryptValue(dto.buyerAddress) : null,
        platform_ship_address_snapshot: process.env.PLATFORM_INSPECTION_ADDRESS ?? "Qinshixian platform inspection desk",
        order_channel: "H5",
        source_id: dto.tracking?.sourceId,
        campaign_id: dto.tracking?.campaignId,
        tracking_link_id: dto.tracking?.trackingLinkId,
        status: "DEPOSIT_PENDING",
        status_logs: { create: { to_status: "DEPOSIT_PENDING", note: "buyer created order" } }
      }
    });
    if (dto.tracking?.trackingLinkId) {
      await this.prisma.trackingLink.update({ where: { id: dto.tracking.trackingLinkId }, data: { order_count: { increment: 1 } } });
    }
    return order;
  }

  buyerOrders(buyerId: string) {
    return this.prisma.order.findMany({ where: { buyer_id: buyerId, deleted_at: null }, include: { listing: true }, orderBy: { created_at: "desc" } });
  }

  async buyerOrder(buyerId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, buyer_id: buyerId },
      include: { listing: { include: { images: true } }, payments: true, status_logs: true, support_tickets: true }
    });
    if (!order) throw new NotFoundException("訂單不存在。");
    return order;
  }

  knitterOrders(knitterId: string) {
    return this.prisma.order.findMany({ where: { knitter_id: knitterId, deleted_at: null }, select: this.knitterOrderSelect(), orderBy: { created_at: "desc" } });
  }

  async acceptOrder(knitterId: string, orderId: string) {
    const profile = await this.prisma.knitterProfile.findUnique({ where: { user_id: knitterId } });
    if (!profile || profile.application_status !== "APPROVED") throw new UnauthorizedException("織女審核通過後才可以接單。");
    const order = await this.prisma.order.findFirst({ where: { id: orderId, knitter_id: knitterId } });
    if (!order || order.status !== "AWAITING_KNITTER_ACCEPTANCE") throw new BadRequestException("訂單狀態不可接單。");
    const acceptedAt = new Date();
    const dueAt = order.delivery_days_snapshot ? new Date(acceptedAt.getTime() + order.delivery_days_snapshot * 86400000) : null;
    return this.transitionOrder(order.id, "IN_PROGRESS", knitterId, { accepted_at: acceptedAt, due_at: dueAt }, "knitter accepted");
  }

  async markSentToPlatform(knitterId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId, knitter_id: knitterId } });
    if (!order || order.status !== "IN_PROGRESS") throw new BadRequestException("訂單狀態不可標記出貨至平台。");
    return this.transitionOrder(order.id, "SENT_TO_PLATFORM", knitterId, {}, "knitter sent to platform");
  }

  async adminInspectionPassed(actorId: string, orderId: string) {
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "OPS"]);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || !["SENT_TO_PLATFORM", "PLATFORM_INSPECTION", "IN_PROGRESS"].includes(order.status)) {
      throw new BadRequestException("訂單狀態不可驗收。");
    }
    return this.transitionOrder(order.id, "BALANCE_PENDING", actorId, {}, "platform inspection passed");
  }

  async adminShip(actorId: string, orderId: string) {
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "OPS"]);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "BALANCE_PAID") throw new BadRequestException("尾款支付後才可以平台出貨。");
    return this.transitionOrder(order.id, "PLATFORM_SHIPPED", actorId, {}, "platform shipped");
  }

  async completeOrder(actorId: string, orderId: string) {
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "OPS"]);
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { listing: true } });
    if (!order || order.status !== "PLATFORM_SHIPPED") throw new BadRequestException("訂單狀態不可完成。");
    const completed = await this.transitionOrder(order.id, "COMPLETED", actorId, {}, "order completed");
    await this.createSettlement(order);
    return completed;
  }

  async createSupportTicket(userId: string, type: "BUYER_PLATFORM" | "KNITTER_PLATFORM", orderId?: string, message?: string) {
    return this.prisma.supportTicket.create({
      data: { created_by_user_id: userId, ticket_type: type, order_id: orderId, messages: message ? { create: { sender_user_id: userId, visibility: type, message_text: message } } : undefined },
      include: { messages: true }
    });
  }

  ticketsForUser(userId: string, type: "BUYER_PLATFORM" | "KNITTER_PLATFORM") {
    return this.prisma.supportTicket.findMany({ where: { created_by_user_id: userId, ticket_type: type }, include: { messages: true } });
  }

  async trackingRedirect(code: string, path: string, ip?: string, userAgent?: string) {
    const link = await this.prisma.trackingLink.findUnique({ where: { code } });
    if (!link) throw new NotFoundException("追蹤連結不存在。");
    await this.prisma.$transaction([
      this.prisma.trackingLink.update({ where: { id: link.id }, data: { click_count: { increment: 1 } } }),
      this.prisma.trackingEvent.create({ data: { tracking_link_id: link.id, source_id: link.source_id, campaign_id: link.campaign_id, event_type: "PAGE_VIEW", path, ip, user_agent: userAgent } })
    ]);
    return link;
  }

  async adminFunnel(actorId: string) {
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN", "MARKETING"]);
    return this.prisma.trackingLink.findMany({ orderBy: { created_at: "desc" } });
  }

  async audit(actorId: string) {
    await this.auth.assertEmployee(actorId, ["SUPER_ADMIN"]);
    return this.prisma.auditLog.findMany({ orderBy: { created_at: "desc" }, take: 100 });
  }

  private async transitionOrder(orderId: string, to: OrderStatus, actorId: string, data: Prisma.OrderUpdateInput, note: string) {
    const current = await this.prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    const order = await this.prisma.order.update({ where: { id: orderId }, data: { ...data, status: to } });
    await this.prisma.orderStatusLog.create({ data: { order_id: orderId, from_status: current.status, to_status: to, changed_by: actorId, note } });
    return order;
  }

  private async createSettlement(order: { id: string; knitter_id: string | null; cooperation_mode_snapshot: string; total_price_cents: number; listing: { labor_fee_cents: number | null } }) {
    if (!order.knitter_id) return null;
    if (order.cooperation_mode_snapshot === "COMMISSION_5") {
      const settlement = calculateCommission(order.total_price_cents, 0.05);
      return this.prisma.settlement.create({
        data: {
          order_id: order.id,
          knitter_id: order.knitter_id,
          settlement_type: "COMMISSION_ORDER",
          gross_amount_cents: order.total_price_cents,
          commission_amount_cents: settlement.commissionAmountCents,
          payout_amount_cents: settlement.payoutAmountCents
        }
      });
    }
    if (order.cooperation_mode_snapshot === "PLATFORM_BUYOUT_SERVICE") {
      const fee = order.listing.labor_fee_cents ?? 0;
      return this.prisma.settlement.create({
        data: { order_id: order.id, knitter_id: order.knitter_id, settlement_type: "BUYOUT_LABOR_FEE", gross_amount_cents: fee, payout_amount_cents: fee }
      });
    }
    return null;
  }

  private knitterOrderSelect() {
    return {
      id: true,
      order_no: true,
      listing_id: true,
      total_price_cents: true,
      deposit_amount_cents: true,
      balance_amount_cents: true,
      currency: true,
      delivery_days_snapshot: true,
      accepted_at: true,
      due_at: true,
      order_channel: true,
      status: true,
      created_at: true,
      updated_at: true,
      listing: { select: { title: true, images: true } }
    } satisfies Prisma.OrderSelect;
  }
}
