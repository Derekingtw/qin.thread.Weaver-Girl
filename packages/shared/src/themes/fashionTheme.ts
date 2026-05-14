import type { QinshixianTheme } from "./types.js";

export const fashionTheme: QinshixianTheme = {
  name: "fashion",
  displayName: { zhHant: "時尚風", zhHans: "时尚风", en: "Fashion" },
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceSoft: "#FAF8F4",
    primary: "#0F1E1B",
    accent: "#B68A5B",
    textPrimary: "#111111",
    textSecondary: "#666666",
    border: "#E8E2D7"
  },
  typography: {
    headingFamily: '"Noto Serif TC", "Songti TC", serif',
    bodyFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    headingWeight: 500,
    tracking: "0.04em"
  },
  radius: { card: "6px", button: "4px", panel: "0px" },
  spacing: { sectionY: "64px", cardPadding: "24px", heroGap: "38px" },
  shadows: { card: "none", floating: "0 18px 54px rgba(17,17,17,0.08)" },
  borders: { card: "1px solid #E8E2D7", divider: "1px solid #E8E2D7" },
  iconStyle: "line",
  cardStyle: "editorial",
  buttonStyle: "minimal",
  sectionStyle: "gallery"
};
