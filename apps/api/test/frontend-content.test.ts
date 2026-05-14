import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("frontend Qinshixian content", () => {
  it("about page does not expose cooperation enum codes", () => {
    const about = read("apps/web/app/about/page.tsx");
    expect(about).not.toContain("<h2>COMMISSION_5</h2>");
    expect(about).not.toContain("<h2>PLATFORM_BUYOUT_SERVICE</h2>");
    expect(about).not.toContain("<h2>READY_MADE_TO_PLATFORM</h2>");
    expect(about).toContain("關於秦時線");
  });

  it("guarantee page and header route exist", () => {
    const guarantee = read("apps/web/app/guarantee/page.tsx");
    const header = read("apps/web/components/Header.tsx");
    expect(guarantee).toContain("秦時線保障");
    expect(guarantee).toContain("織女付費推廣需審核後才展示");
    expect(header).toContain("/guarantee");
  });

  it("language and style toggles support English and three themes", () => {
    const i18n = read("apps/web/lib/i18n.tsx");
    expect(i18n).toContain('"en"');
    expect(i18n).toContain('"fashion"');
    expect(i18n).toContain('"cozy"');
    expect(i18n).toContain('"chinese"');
  });
});
