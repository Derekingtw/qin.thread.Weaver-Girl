import { describe, expect, it } from "vitest";
import { getCooperationModeDescription, getCooperationModeDisplay } from "./cooperationModeDisplay.js";

describe("cooperation mode display mapper", () => {
  it("maps cooperation modes to Traditional Chinese", () => {
    expect(getCooperationModeDisplay("COMMISSION_5", "zh-Hant")).toBe("秦時線抽成委託");
    expect(getCooperationModeDisplay("PLATFORM_BUYOUT_SERVICE", "zh-Hant")).toBe("秦時線買斷服務");
    expect(getCooperationModeDisplay("READY_MADE_TO_PLATFORM", "zh-Hant")).toBe("成衣收購");
  });

  it("maps cooperation modes to Simplified Chinese", () => {
    expect(getCooperationModeDisplay("COMMISSION_5", "zh-Hans")).toBe("秦时线抽成委托");
    expect(getCooperationModeDisplay("PLATFORM_OWNED_INVENTORY", "zh-Hans")).toBe("秦时线自营选品");
  });

  it("maps cooperation modes to English", () => {
    expect(getCooperationModeDisplay("COMMISSION_5", "en")).toBe("Commission-based Service");
    expect(getCooperationModeDisplay("READY_MADE_TO_PLATFORM", "en")).toBe("Ready-made Purchase");
  });

  it("does not expose raw enum codes in descriptions", () => {
    expect(getCooperationModeDescription("PLATFORM_BUYOUT_SERVICE", "zh-Hant")).not.toContain("PLATFORM_BUYOUT_SERVICE");
  });
});
