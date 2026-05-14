"use client";

import { useLanguage, useStyleTheme, type StyleTheme } from "../lib/i18n";

const themes: Array<{ value: StyleTheme; labelKey: "themeFashion" | "themeCozy" | "themeChinese" }> = [
  { value: "fashion", labelKey: "themeFashion" },
  { value: "cozy", labelKey: "themeCozy" },
  { value: "chinese", labelKey: "themeChinese" }
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useStyleTheme();
  const { t } = useLanguage();
  return (
    <div className={`theme-toggle ${compact ? "compact" : ""}`} aria-label={t("style")}>
      {themes.map((item) => (
        <button
          className={theme === item.value ? "active" : ""}
          key={item.value}
          onClick={() => setTheme(item.value)}
          type="button"
        >
          {compact ? t(item.labelKey).slice(0, 1) : t(item.labelKey)}
        </button>
      ))}
    </div>
  );
}
