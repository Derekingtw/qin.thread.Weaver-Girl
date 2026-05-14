import type { QinshixianTheme } from "./types.js";

export const cozyTheme: QinshixianTheme = {
  name: "cozy",
  displayName: { zhHant: "溫馨風", zhHans: "温馨风", en: "Cozy" },
  colors: {
    background: "#FAF7F2",
    surface: "#FFFFFF",
    surfaceSoft: "#FFF9F3",
    primary: "#3F766F",
    accent: "#C48969",
    textPrimary: "#2F3437",
    textSecondary: "#6F777C",
    border: "#E9E2D8"
  },
  typography: {
    headingFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    bodyFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    headingWeight: 700,
    tracking: "0"
  },
  radius: { card: "18px", button: "12px", panel: "28px" },
  spacing: { sectionY: "42px", cardPadding: "18px", heroGap: "28px" },
  shadows: { card: "0 14px 34px rgba(47,52,55,0.08)", floating: "0 18px 54px rgba(63,118,111,0.1)" },
  borders: { card: "1px solid #E9E2D8", divider: "1px solid rgba(233,226,216,0.9)" },
  iconStyle: "soft",
  cardStyle: "warm",
  buttonStyle: "rounded",
  sectionStyle: "homey"
};
