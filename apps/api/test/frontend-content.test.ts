import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const exists = (path: string) => existsSync(resolve(root, path));

describe("frontend Qinshixian content", () => {
  it("uses the official logo asset in the shared Logo component", () => {
    const logo = read("apps/web/components/Logo.tsx");
    const css = read("apps/web/styles/theme.css");
    expect(exists("apps/web/public/brand/qinshixian-logo-main.png")).toBe(true);
    expect(exists("apps/web/public/brand/qinshixian-logo-main-light.png")).toBe(true);
    expect(exists("apps/web/public/brand/qinshixian-logo-main-dark.png")).toBe(true);
    expect(logo).toContain("/brand/qinshixian-logo-main.png");
    expect(logo).toContain("/brand/qinshixian-logo-main-dark.png");
    expect(css).toContain("object-fit: contain");
  });

  it("about page does not expose cooperation enum codes as headings", () => {
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

  it("language and theme switching support English and three themes", () => {
    const i18n = read("apps/web/lib/i18n.tsx");
    const themeToggle = read("apps/web/components/ThemeToggle.tsx");
    expect(i18n).toContain('"en"');
    expect(i18n).toContain('"fashion"');
    expect(i18n).toContain('"cozy"');
    expect(i18n).toContain('"chinese"');
    expect(i18n).toContain("qinshixian_style");
    expect(themeToggle).toContain("themeFashion");
  });

  it("mobile layout has sticky CTA and snap rows", () => {
    const css = read("apps/web/styles/theme.css");
    expect(css).toContain(".mobile-sticky-cta");
    expect(css).toContain("scroll-snap-type: x mandatory");
    expect(css).toContain("safe-area-inset-bottom");
  });

  it("footer still renders through the shared footer component", () => {
    const layout = read("apps/web/app/layout.tsx");
    const footer = read("apps/web/components/Footer.tsx");
    const logo = read("apps/web/components/Logo.tsx");
    expect(layout).toContain("<Footer />");
    expect(footer).toContain("<Logo footer />");
    expect(logo).toContain("footer-logo");
  });
});
