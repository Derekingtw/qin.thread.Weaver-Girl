import { describe, expect, it } from "vitest";
import { CooperationMode, OrderStatus } from "./enums.js";
import {
  canPayBalance,
  createOrderPriceSnapshot,
  dueAtFromAcceptedAt,
  nextStatusAfterDeposit,
  sanitizeBuyerOrder,
  sanitizeKnitterOrder,
  settlementForCompletedOrder
} from "./domainRules.js";

describe("auth and order domain rules", () => {
  it("buyer order calculates 50% deposit", () => {
    expect(createOrderPriceSnapshot(100000)).toEqual({ depositAmountCents: 50000, balanceAmountCents: 50000 });
  });

  it("deposit payment enters correct status by cooperation mode", () => {
    expect(nextStatusAfterDeposit(CooperationMode.COMMISSION_5)).toBe(OrderStatus.AWAITING_KNITTER_ACCEPTANCE);
    expect(nextStatusAfterDeposit(CooperationMode.PLATFORM_BUYOUT_SERVICE)).toBe(OrderStatus.IN_PROGRESS);
    expect(nextStatusAfterDeposit(CooperationMode.PLATFORM_OWNED_INVENTORY)).toBe(OrderStatus.BALANCE_PENDING);
  });

  it("knitter acceptance creates due_at", () => {
    expect(dueAtFromAcceptedAt(new Date("2026-05-13T00:00:00Z"), 14).toISOString()).toBe("2026-05-27T00:00:00.000Z");
  });

  it("balance can only be paid in BALANCE_PENDING", () => {
    expect(canPayBalance(OrderStatus.BALANCE_PENDING)).toBe(true);
    expect(canPayBalance(OrderStatus.IN_PROGRESS)).toBe(false);
  });
});

describe("settlement rules", () => {
  it("COMMISSION_5 charges 5 percent", () => {
    expect(settlementForCompletedOrder({ mode: CooperationMode.COMMISSION_5, totalPriceCents: 100000 })).toMatchObject({
      settlementType: "COMMISSION_ORDER",
      commissionAmountCents: 5000,
      payoutAmountCents: 95000
    });
  });

  it("PLATFORM_BUYOUT_SERVICE only pays labor fee", () => {
    expect(settlementForCompletedOrder({ mode: CooperationMode.PLATFORM_BUYOUT_SERVICE, totalPriceCents: 120000, laborFeeCents: 30000 })).toMatchObject({
      settlementType: "BUYOUT_LABOR_FEE",
      payoutAmountCents: 30000
    });
  });

  it("READY_MADE_TO_PLATFORM creates one-time purchase settlement", () => {
    expect(settlementForCompletedOrder({ mode: CooperationMode.PLATFORM_OWNED_INVENTORY, totalPriceCents: 0, readyMadePurchaseCents: 45000 })).toMatchObject({
      settlementType: "READY_MADE_PURCHASE",
      payoutAmountCents: 45000
    });
  });
});

describe("privacy serializers", () => {
  it("buyer order does not include knitter private fields", () => {
    expect(sanitizeBuyerOrder({ id: "o1", knitter_phone: "139", knitter_payout_account: "bank" })).toEqual({ id: "o1" });
  });

  it("knitter order does not include buyer address", () => {
    expect(sanitizeKnitterOrder({ id: "o1", buyer_phone: "139", buyer_address_encrypted: "secret" })).toEqual({ id: "o1" });
  });
});
