"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "zh-Hant" | "zh-Hans" | "en";
export type StyleTheme = "fashion" | "cozy" | "chinese";

type DictionaryKey =
  | "findWorks"
  | "platformProducts"
  | "announcements"
  | "knitterJoin"
  | "protection"
  | "about"
  | "login"
  | "register"
  | "loginRegister"
  | "allWorks"
  | "allProducts"
  | "announcementSubtitle"
  | "promotedAdsTitle"
  | "promotedAdsSubtitle"
  | "paidPromotion"
  | "applyPromotion"
  | "emptyAdTitle"
  | "emptyAdBody"
  | "hotWorks"
  | "hotWorksSubtitle"
  | "platformProductsTitle"
  | "platformProductsSubtitle"
  | "cooperationModes"
  | "joinTitle"
  | "joinBody"
  | "joinNow"
  | "learnFlow"
  | "footerLine"
  | "quickLinks"
  | "support"
  | "subscribe"
  | "emailPlaceholder"
  | "brandStory"
  | "qinGuarantee"
  | "exploreWorks"
  | "startCommission"
  | "themeFashion"
  | "themeCozy"
  | "themeChinese"
  | "style";

type Dictionary = Record<DictionaryKey, Record<Locale, string>>;

export const dictionary: Dictionary = {
  findWorks: { "zh-Hant": "找作品", "zh-Hans": "找作品", en: "Find Works" },
  platformProducts: { "zh-Hant": "秦時線自營", "zh-Hans": "秦时线自营", en: "Qin Selection" },
  announcements: { "zh-Hant": "活動公告", "zh-Hans": "活动公告", en: "Announcements" },
  knitterJoin: { "zh-Hant": "織女入駐", "zh-Hans": "织女入驻", en: "Join as Knitter" },
  protection: { "zh-Hant": "秦時線保障", "zh-Hans": "秦时线保障", en: "Qin Guarantee" },
  about: { "zh-Hant": "關於我們", "zh-Hans": "关于我们", en: "About" },
  login: { "zh-Hant": "登入", "zh-Hans": "登录", en: "Login" },
  register: { "zh-Hant": "註冊", "zh-Hans": "注册", en: "Register" },
  loginRegister: { "zh-Hant": "登入 / 註冊", "zh-Hans": "登录 / 注册", en: "Login / Register" },
  allWorks: { "zh-Hant": "查看作品", "zh-Hans": "查看作品", en: "View Works" },
  allProducts: { "zh-Hant": "查看選品", "zh-Hans": "查看选品", en: "View Selection" },
  announcementSubtitle: { "zh-Hant": "秦時線近期活動與服務更新", "zh-Hans": "秦时线近期活动与服务更新", en: "Latest Qin Thread updates" },
  promotedAdsTitle: { "zh-Hant": "織女推薦推廣", "zh-Hans": "织女推荐推广", en: "Featured Knitters" },
  promotedAdsSubtitle: { "zh-Hant": "固定三格展示，需完成廣告費支付並通過秦時線審核。", "zh-Hans": "固定三格展示，需完成广告费支付并通过秦时线审核。", en: "Three reviewed paid placements for approved knitters." },
  paidPromotion: { "zh-Hant": "織女付費推廣", "zh-Hans": "织女付费推广", en: "Paid Promotion" },
  applyPromotion: { "zh-Hant": "申請推廣", "zh-Hans": "申请推广", en: "Apply" },
  emptyAdTitle: { "zh-Hant": "推廣位開放中", "zh-Hans": "推广位开放中", en: "Placement Available" },
  emptyAdBody: { "zh-Hant": "通過審核的織女可申請首頁曝光，廣告內容不得包含私下聯絡方式。", "zh-Hans": "通过审核的织女可申请首页曝光，广告内容不得包含私下联系方式。", en: "Approved knitters can apply after review and payment." },
  hotWorks: { "zh-Hant": "熱門手作委託", "zh-Hans": "热门手作委托", en: "Popular Commissions" },
  hotWorksSubtitle: { "zh-Hant": "由秦時線協調需求、驗收作品與安排交付。", "zh-Hans": "由秦时线协调需求、验收作品与安排交付。", en: "Coordinated, inspected, and delivered by Qin Thread." },
  platformProductsTitle: { "zh-Hant": "秦時線自營選品", "zh-Hans": "秦时线自营选品", en: "Qin Selection" },
  platformProductsSubtitle: { "zh-Hant": "材料包、工具與禮盒，由秦時線企劃與管理。", "zh-Hans": "材料包、工具与礼盒，由秦时线企划与管理。", en: "Curated kits, tools, gifts, and owned inventory." },
  cooperationModes: { "zh-Hant": "三種合作方式", "zh-Hans": "三种合作方式", en: "Ways to Work With Us" },
  joinTitle: { "zh-Hant": "成為秦時線織女", "zh-Hans": "成为秦时线织女", en: "Become a Qin Thread Knitter" },
  joinBody: { "zh-Hant": "提交作品與資料，通過審核後即可發布作品、接單與申請曝光。", "zh-Hans": "提交作品与资料，通过审核后即可发布作品、接单与申请曝光。", en: "Submit your work and profile. Once approved, you can publish, take commissions, and apply for exposure." },
  joinNow: { "zh-Hant": "申請入駐", "zh-Hans": "申请入驻", en: "Apply to Join" },
  learnFlow: { "zh-Hant": "了解流程", "zh-Hans": "了解流程", en: "Learn the Flow" },
  footerLine: { "zh-Hant": "秦時線串起想像與雙手的溫度，讓委託、製作、驗收與交付都更安心。", "zh-Hans": "秦时线串起想象与双手的温度，让委托、制作、验收与交付都更安心。", en: "Qin Thread connects imagination, hands, and trust from commission to delivery." },
  quickLinks: { "zh-Hant": "快速連結", "zh-Hans": "快速链接", en: "Quick Links" },
  support: { "zh-Hant": "服務支援", "zh-Hans": "服务支持", en: "Support" },
  subscribe: { "zh-Hant": "訂閱消息", "zh-Hans": "订阅消息", en: "Subscribe" },
  emailPlaceholder: { "zh-Hant": "輸入 Email", "zh-Hans": "输入 Email", en: "Email address" },
  brandStory: { "zh-Hant": "品牌故事", "zh-Hans": "品牌故事", en: "Brand Story" },
  qinGuarantee: { "zh-Hant": "秦時線保障", "zh-Hans": "秦时线保障", en: "Qin Guarantee" },
  exploreWorks: { "zh-Hant": "探索作品", "zh-Hans": "探索作品", en: "Explore" },
  startCommission: { "zh-Hant": "開始委託", "zh-Hans": "开始委托", en: "Start" },
  themeFashion: { "zh-Hant": "時尚風", "zh-Hans": "时尚风", en: "Fashion" },
  themeCozy: { "zh-Hant": "溫馨風", "zh-Hans": "温馨风", en: "Cozy" },
  themeChinese: { "zh-Hant": "中國風", "zh-Hans": "中国风", en: "Chinese" },
  style: { "zh-Hant": "風格", "zh-Hans": "风格", en: "Style" }
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
} | null>(null);

const StyleContext = createContext<{
  theme: StyleTheme;
  setTheme: (theme: StyleTheme) => void;
} | null>(null);

export function normalizeLocale(value?: string | null): Locale {
  if (value === "zh-Hans" || value === "en") return value;
  return "zh-Hant";
}

export function normalizeStyleTheme(value?: string | null): StyleTheme {
  if (value === "fashion" || value === "chinese") return value;
  return "cozy";
}

export function pickLocalizedText(
  value: { zhHant?: string | null; zhHans?: string | null; en?: string | null },
  locale: Locale
) {
  if (locale === "en") return value.en || value.zhHant || value.zhHans || "";
  if (locale === "zh-Hans") return value.zhHans || value.zhHant || value.en || "";
  return value.zhHant || value.zhHans || value.en || "";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-Hant");

  useEffect(() => {
    const saved = window.localStorage.getItem("qinshixian_locale");
    setLocaleState(normalizeLocale(saved));
  }, []);

  const value = useMemo(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem("qinshixian_locale", nextLocale);
      document.cookie = `qinshixian_locale=${nextLocale};path=/;max-age=31536000`;
      document.documentElement.lang = nextLocale;
      const token = window.localStorage.getItem("qinshixian_token");
      void fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/user/preferred-locale`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ locale: nextLocale })
      }).catch(() => undefined);
    };
    return { locale, setLocale, t: (key: DictionaryKey) => dictionary[key][locale] };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function StyleThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<StyleTheme>("cozy");

  useEffect(() => {
    const saved = window.localStorage.getItem("qinshixian_style");
    setThemeState(normalizeStyleTheme(saved));
  }, []);

  useEffect(() => {
    document.body.classList.remove("theme-fashion", "theme-cozy", "theme-chinese");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = useMemo(() => {
    const setTheme = (nextTheme: StyleTheme) => {
      setThemeState(nextTheme);
      window.localStorage.setItem("qinshixian_style", nextTheme);
      const token = window.localStorage.getItem("qinshixian_token");
      void fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/user/preferred-style`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ style: nextTheme })
      }).catch(() => undefined);
    };
    return { theme, setTheme };
  }, [theme]);

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function useStyleTheme() {
  const context = useContext(StyleContext);
  if (!context) throw new Error("useStyleTheme must be used inside StyleThemeProvider");
  return context;
}
