import { describe, expect, it } from "vitest";
import {
  CONTACT_INFO_ERROR,
  CooperationMode,
  OrderStatus,
  hasContactInfo,
  nextStatusAfterDeposit
} from "../../../packages/shared/src/index";

describe("api rule smoke tests", () => {
  it("blocks private contact information before listing or ad submission", () => {
    expect(hasContactInfo("請加我微信 wx: knit8888")).toBe(true);
    expect(hasContactInfo("Email: hello@example.com")).toBe(true);
    expect(CONTACT_INFO_ERROR).toContain("站外聯絡資訊");
  });

  it("uses shared order state rules", () => {
    expect(nextStatusAfterDeposit(CooperationMode.COMMISSION_5)).toBe(OrderStatus.AWAITING_KNITTER_ACCEPTANCE);
    expect(nextStatusAfterDeposit(CooperationMode.PLATFORM_OWNED_INVENTORY)).toBe(OrderStatus.BALANCE_PENDING);
  });
});
