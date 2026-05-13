"use client";

import { useLanguage } from "../lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="language-toggle" aria-label="Language">
      <button className={locale === "zh-Hant" ? "active" : ""} onClick={() => setLocale("zh-Hant")} type="button">繁</button>
      <button className={locale === "zh-Hans" ? "active" : ""} onClick={() => setLocale("zh-Hans")} type="button">简</button>
    </div>
  );
}
