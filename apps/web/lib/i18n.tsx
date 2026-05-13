"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "zh-Hant" | "zh-Hans";
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
  | "hotWorks"
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
  | "emailPlaceholder";
type Dictionary = Record<DictionaryKey, { "zh-Hant": string; "zh-Hans": string }>;

export const dictionary: Dictionary = {
  findWorks: { "zh-Hant": "找作品", "zh-Hans": "找作品" },
  platformProducts: { "zh-Hant": "平台自營", "zh-Hans": "平台自营" },
  announcements: { "zh-Hant": "活動公告", "zh-Hans": "活动公告" },
  knitterJoin: { "zh-Hant": "織女入駐", "zh-Hans": "织女入驻" },
  protection: { "zh-Hant": "平台保障", "zh-Hans": "平台保障" },
  about: { "zh-Hant": "關於我們", "zh-Hans": "关于我们" },
  login: { "zh-Hant": "登入", "zh-Hans": "登录" },
  register: { "zh-Hant": "註冊", "zh-Hans": "注册" },
  loginRegister: { "zh-Hant": "登入 / 註冊", "zh-Hans": "登录 / 注册" },
  allWorks: { "zh-Hant": "查看全部作品", "zh-Hans": "查看全部作品" },
  allProducts: { "zh-Hant": "查看全部商品", "zh-Hans": "查看全部商品" },
  announcementSubtitle: { "zh-Hant": "近期活動與平台更新", "zh-Hans": "近期活动与平台更新" },
  promotedAdsTitle: { "zh-Hant": "織女推薦推廣", "zh-Hans": "织女推荐推广" },
  promotedAdsSubtitle: { "zh-Hant": "固定三格，織女支付廣告費後才可上架。", "zh-Hans": "固定三格，织女支付广告费后才可上架。" },
  paidPromotion: { "zh-Hant": "織女付費推廣", "zh-Hans": "织女付费推广" },
  hotWorks: { "zh-Hant": "熱門手作委託", "zh-Hans": "热门手作委托" },
  platformProductsTitle: { "zh-Hant": "平台自營商品", "zh-Hans": "平台自营商品" },
  platformProductsSubtitle: { "zh-Hant": "材料包、工具包與禮盒", "zh-Hans": "材料包、工具包与礼盒" },
  cooperationModes: { "zh-Hant": "合作模式", "zh-Hans": "合作模式" },
  joinTitle: { "zh-Hant": "成為秦時線織女", "zh-Hans": "成为秦时线织女" },
  joinBody: { "zh-Hant": "提交作品與資料，通過審核後即可發布作品、接單與申請曝光。", "zh-Hans": "提交作品与资料，通过审核后即可发布作品、接单与申请曝光。" },
  joinNow: { "zh-Hant": "申請入駐", "zh-Hans": "申请入驻" },
  learnFlow: { "zh-Hant": "了解流程", "zh-Hans": "了解流程" },
  footerLine: { "zh-Hant": "秦時線串起想像與雙手的溫度，讓每一次手作委託都在信任中完成。", "zh-Hans": "秦时线串起想象与双手的温度，让每一次手作委托都在信任中完成。" },
  quickLinks: { "zh-Hant": "快速連結", "zh-Hans": "快速链接" },
  support: { "zh-Hant": "支援", "zh-Hans": "支持" },
  subscribe: { "zh-Hant": "訂閱更新", "zh-Hans": "订阅更新" },
  emailPlaceholder: { "zh-Hant": "輸入 Email", "zh-Hans": "输入 Email" }
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
} | null>(null);

export function normalizeLocale(value?: string | null): Locale {
  return value === "zh-Hans" ? "zh-Hans" : "zh-Hant";
}

export function pickLocalizedText(value: { zhHant?: string | null; zhHans?: string | null }, locale: Locale) {
  if (locale === "zh-Hans") return value.zhHans || value.zhHant || "";
  return value.zhHant || value.zhHans || "";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-Hant");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("qinshixian_locale") : null;
    setLocaleState(normalizeLocale(saved));
  }, []);

  const value = useMemo(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem("qinshixian_locale", nextLocale);
      document.cookie = `qinshixian_locale=${nextLocale};path=/;max-age=31536000`;
      const token = window.localStorage.getItem("qinshixian_token");
      void fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/user/preferred-locale`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ locale: nextLocale })
      }).catch(() => undefined);
    };
    return {
      locale,
      setLocale,
      t: (key: DictionaryKey) => dictionary[key][locale]
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
