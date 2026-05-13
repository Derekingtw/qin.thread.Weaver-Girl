import { describe, expect, it } from "vitest";
import { detectContactInfo, hasContactInfo } from "./contactInfoDetector.js";

describe("contactInfoDetector", () => {
  it("detects mobile phones and private contact hints", () => {
    expect(hasContactInfo("可以加我微信 wx: knit8888，也可打 13812345678")).toBe(true);
    expect(detectContactInfo("作品描述乾淨，無聯絡方式")).toEqual([]);
  });
});
