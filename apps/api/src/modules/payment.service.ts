import { BadRequestException, Injectable } from "@nestjs/common";
import { CooperationMode, OrderStatus, PaymentType, Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async pay(orderId: string, buyerId: string, paymentType: Exclude<PaymentType, "AD_FEE">) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({ where: { id: orderId, buyer_id: buyerId } });
      if (!order) throw new BadRequestException("訂單不存在。");
      const amount = paymentType === "DEPOSIT" ? order.deposit_amount_cents : order.balance_amount_cents;
      const requiredStatus = paymentType === "DEPOSIT" ? "DEPOSIT_PENDING" : "BALANCE_PENDING";
      if (order.status !== requiredStatus) throw new BadRequestException(`${paymentType} 目前不可支付。`);

      const existingPaid = await tx.payment.findFirst({ where: { order_id: order.id, payment_type: paymentType, status: "PAID" } });
      if (existingPaid) return { payment: existingPaid, order };

      const idempotencyKey = `${order.id}:${paymentType}`;
      const payment = await tx.payment.upsert({
        where: { idempotency_key: idempotencyKey },
        update: {},
        create: {
          order_id: order.id,
          payment_type: paymentType,
          amount_cents: amount,
          currency: order.currency,
          provider: "MOCK",
          idempotency_key: idempotencyKey,
          status: "PENDING",
          raw_payload: { provider: "MockPaymentProvider" }
        }
      });
      return this.markPaid(tx, payment.id, { mock: true });
    });
  }

  async payAdFee(adApplicationId: string, knitterId: string) {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.adApplication.findFirst({
        where: { id: adApplicationId, knitter_id: knitterId, deleted_at: null },
        include: { package: true }
      });
      if (!application) throw new BadRequestException("廣告申請不存在。");
      if (application.status !== "APPROVED_PENDING_PAYMENT") throw new BadRequestException("此廣告申請目前不可付款。");
      if (application.payment_deadline_at && application.payment_deadline_at < new Date()) {
        await tx.adApplication.update({ where: { id: application.id }, data: { status: "PAYMENT_EXPIRED" } });
        throw new BadRequestException("廣告付款期限已過。");
      }

      const existingPaid = await tx.payment.findFirst({ where: { ad_application_id: application.id, payment_type: "AD_FEE", status: "PAID" } });
      if (existingPaid) return { payment: existingPaid, adApplication: application };

      const payment = await tx.payment.upsert({
        where: { idempotency_key: `ad:${application.id}` },
        update: {},
        create: {
          ad_application_id: application.id,
          payment_type: "AD_FEE",
          amount_cents: application.package.price_cents,
          currency: application.package.currency,
          provider: "MOCK",
          idempotency_key: `ad:${application.id}`,
          status: "PENDING",
          raw_payload: { provider: "MockPaymentProvider", revenue: "platform" }
        }
      });
      return this.markPaid(tx, payment.id, { mock: true, paymentType: "AD_FEE" });
    });
  }

  async notify(providerTransactionId: string, idempotencyKey: string, payload: unknown) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { idempotency_key: idempotencyKey } });
      if (!payment) throw new BadRequestException("payment not found");
      if (payment.status === "PAID") return payment;
      return this.markPaid(tx, payment.id, { providerTransactionId, payload });
    });
  }

  private async markPaid(tx: Prisma.TransactionClient, paymentId: string, payload: unknown) {
    const payment = await tx.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: { order: true, ad_application: true }
    });
    if (payment.status === "PAID") return { payment, order: payment.order, adApplication: payment.ad_application };

    const paid = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paid_at: new Date(),
        provider_transaction_id: payment.provider_transaction_id ?? `mock_${payment.id}`,
        raw_payload: payload as Prisma.InputJsonValue
      }
    });

    if (payment.payment_type === "AD_FEE") {
      if (!payment.ad_application_id) throw new BadRequestException("AD_FEE payment missing ad_application_id");
      const adApplication = await tx.adApplication.update({
        where: { id: payment.ad_application_id },
        data: { status: "PAID", paid_at: new Date() }
      });
      return { payment: paid, adApplication };
    }

    if (!payment.order) throw new BadRequestException("Order payment missing order");
    if (!payment.order_id) throw new BadRequestException("Order payment missing order_id");

    const nextStatus = this.nextStatusAfterPayment(payment.payment_type, payment.order.cooperation_mode_snapshot);
    const order = await tx.order.update({ where: { id: payment.order_id }, data: { status: nextStatus } });
    await tx.orderStatusLog.create({
      data: {
        order_id: order.id,
        from_status: payment.order.status,
        to_status: nextStatus,
        note: `${payment.payment_type} paid by MockPaymentProvider`
      }
    });
    if (payment.payment_type === "DEPOSIT" && order.tracking_link_id) {
      await tx.trackingLink.update({ where: { id: order.tracking_link_id }, data: { deposit_paid_count: { increment: 1 } } });
    }
    if (payment.payment_type === "BALANCE" && order.tracking_link_id) {
      await tx.trackingLink.update({ where: { id: order.tracking_link_id }, data: { balance_paid_count: { increment: 1 } } });
    }
    return { payment: paid, order };
  }

  private nextStatusAfterPayment(paymentType: PaymentType, cooperationMode: CooperationMode): OrderStatus {
    if (paymentType === "BALANCE") return "BALANCE_PAID";
    if (cooperationMode === "COMMISSION_5") return "AWAITING_KNITTER_ACCEPTANCE";
    if (cooperationMode === "PLATFORM_BUYOUT_SERVICE") return "IN_PROGRESS";
    return "BALANCE_PENDING";
  }
}
