"use client";

import { useLanguage, type Locale } from "../lib/i18n";

const options: Array<{ locale: Locale; label: string }> = [
  { locale: "zh-Hant", label: "繁" },
  { locale: "zh-Hans", label: "简" },
  { locale: "en", label: "EN" }
];

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="language-toggle" aria-label="Language">
      {options.map((option) => (
        <button
          className={locale === option.locale ? "active" : ""}
          key={option.locale}
          onClick={() => setLocale(option.locale)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
