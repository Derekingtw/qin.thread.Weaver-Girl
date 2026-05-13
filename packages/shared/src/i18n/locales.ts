export enum Locale {
  ZH_HANT = "zh-Hant",
  ZH_HANS = "zh-Hans"
}

export function normalizeLocale(value?: string | null): Locale {
  return value === Locale.ZH_HANS ? Locale.ZH_HANS : Locale.ZH_HANT;
}

export function getLocalizedText(
  fields: { zhHant?: string | null; zhHans?: string | null },
  locale?: string | null
) {
  const normalized = normalizeLocale(locale);
  if (normalized === Locale.ZH_HANS) return fields.zhHans || fields.zhHant || "";
  return fields.zhHant || fields.zhHans || "";
}
