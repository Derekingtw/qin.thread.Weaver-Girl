import type { QinshixianTheme } from "./types.js";

export const chineseTheme: QinshixianTheme = {
  name: "chinese",
  displayName: { zhHant: "中國風", zhHans: "中国风", en: "Chinese" },
  colors: {
    background: "#F7F1E6",
    surface: "#FFFDF8",
    surfaceSoft: "#FBF5EA",
    primary: "#315B4F",
    accent: "#9B3A32",
    textPrimary: "#24302C",
    textSecondary: "#7B6F61",
    border: "#DED2BD"
  },
  typography: {
    headingFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
    bodyFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    headingWeight: 600,
    tracking: "0.03em"
  },
  radius: { card: "4px", button: "4px", panel: "8px" },
  spacing: { sectionY: "50px", cardPadding: "22px", heroGap: "30px" },
  shadows: { card: "0 14px 34px rgba(49,91,79,0.1)", floating: "0 18px 44px rgba(36,48,44,0.12)" },
  borders: { card: "1px solid #DED2BD", divider: "1px solid rgba(181,138,74,0.42)" },
  iconStyle: "seal",
  cardStyle: "paper",
  buttonStyle: "outlined-seal",
  sectionStyle: "scroll"
};
