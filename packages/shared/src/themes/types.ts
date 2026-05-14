export type ThemeName = "fashion" | "cozy" | "chinese";

export type QinshixianTheme = {
  name: ThemeName;
  displayName: {
    zhHant: string;
    zhHans: string;
    en: string;
  };
  colors: {
    background: string;
    surface: string;
    surfaceSoft: string;
    primary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    headingFamily: string;
    bodyFamily: string;
    headingWeight: number;
    tracking: string;
  };
  radius: {
    card: string;
    button: string;
    panel: string;
  };
  spacing: {
    sectionY: string;
    cardPadding: string;
    heroGap: string;
  };
  shadows: {
    card: string;
    floating: string;
  };
  borders: {
    card: string;
    divider: string;
  };
  iconStyle: "line" | "soft" | "seal";
  cardStyle: "editorial" | "warm" | "paper";
  buttonStyle: "minimal" | "rounded" | "outlined-seal";
  sectionStyle: "gallery" | "homey" | "scroll";
};
