import { describe, expect, it } from "vitest";
import { getQinshixianTheme, qinshixianThemeNames, qinshixianThemes } from "./index.js";

describe("Qinshixian theme tokens", () => {
  it("defines all three operating themes", () => {
    expect(qinshixianThemeNames).toEqual(["fashion", "cozy", "chinese"]);
  });

  it("makes fashion, cozy, and chinese visually distinct beyond color", () => {
    expect(qinshixianThemes.fashion.cardStyle).toBe("editorial");
    expect(qinshixianThemes.cozy.cardStyle).toBe("warm");
    expect(qinshixianThemes.chinese.cardStyle).toBe("paper");
    expect(qinshixianThemes.fashion.radius.card).not.toBe(qinshixianThemes.cozy.radius.card);
    expect(qinshixianThemes.chinese.iconStyle).toBe("seal");
  });

  it("falls back to cozy", () => {
    expect(getQinshixianTheme("unknown").name).toBe("cozy");
  });
});
