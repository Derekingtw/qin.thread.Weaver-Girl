import { CooperationMode, OrderStatus } from "./enums.js";
import { calculateCommission, calculateDeposit } from "./money.js";

export function nextStatusAfterDeposit(mode: CooperationMode): OrderStatus {
  if (mode === CooperationMode.COMMISSION_5) return OrderStatus.AWAITING_KNITTER_ACCEPTANCE;
  if (mode === CooperationMode.PLATFORM_BUYOUT_SERVICE) return OrderStatus.IN_PROGRESS;
  return OrderStatus.BALANCE_PENDING;
}

export function canPayBalance(status: OrderStatus) {
  return status === OrderStatus.BALANCE_PENDING;
}

export function dueAtFromAcceptedAt(acceptedAt: Date, deliveryDays: number) {
  return new Date(acceptedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
}

export function createOrderPriceSnapshot(totalPriceCents: number, depositRate = 0.5) {
  return calculateDeposit(totalPriceCents, depositRate);
}

export function settlementForCompletedOrder(input: {
  mode: CooperationMode;
  totalPriceCents: number;
  laborFeeCents?: number | null;
  readyMadePurchaseCents?: number | null;
}) {
  if (input.mode === CooperationMode.COMMISSION_5) {
    const result = calculateCommission(input.totalPriceCents, 0.05);
    return {
      settlementType: "COMMISSION_ORDER" as const,
      grossAmountCents: input.totalPriceCents,
      commissionAmountCents: result.commissionAmountCents,
      payoutAmountCents: result.payoutAmountCents
    };
  }
  if (input.mode === CooperationMode.PLATFORM_BUYOUT_SERVICE) {
    const fee = input.laborFeeCents ?? 0;
    return {
      settlementType: "BUYOUT_LABOR_FEE" as const,
      grossAmountCents: fee,
      commissionAmountCents: 0,
      payoutAmountCents: fee
    };
  }
  const purchase = input.readyMadePurchaseCents ?? 0;
  return {
    settlementType: "READY_MADE_PURCHASE" as const,
    grossAmountCents: purchase,
    commissionAmountCents: 0,
    payoutAmountCents: purchase
  };
}

export function sanitizeBuyerOrder<T extends Record<string, unknown>>(order: T) {
  const clone = { ...order };
  delete clone.knitter_phone;
  delete clone.knitter_wechat;
  delete clone.knitter_payout_account;
  return clone;
}

export function sanitizeKnitterOrder<T extends Record<string, unknown>>(order: T) {
  const clone = { ...order };
  delete clone.buyer_phone;
  delete clone.buyer_name;
  delete clone.buyer_address_encrypted;
  return clone;
}
