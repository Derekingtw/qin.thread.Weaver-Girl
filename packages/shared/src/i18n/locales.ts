export enum Locale {
  ZH_HANT = "zh-Hant",
  ZH_HANS = "zh-Hans",
  EN = "en"
}

export function normalizeLocale(value?: string | null): Locale {
  if (value === Locale.ZH_HANS || value === Locale.EN) return value;
  return Locale.ZH_HANT;
}

export function getLocalizedText(
  fields: { zhHant?: string | null; zhHans?: string | null; en?: string | null },
  locale?: string | null
) {
  const normalized = normalizeLocale(locale);
  if (normalized === Locale.EN) return fields.en || fields.zhHant || fields.zhHans || "";
  if (normalized === Locale.ZH_HANS) return fields.zhHans || fields.zhHant || fields.en || "";
  return fields.zhHant || fields.zhHans || fields.en || "";
}
