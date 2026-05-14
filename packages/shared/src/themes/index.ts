import { chineseTheme } from "./chineseTheme.js";
import { cozyTheme } from "./cozyTheme.js";
import { fashionTheme } from "./fashionTheme.js";
import type { ThemeName } from "./types.js";

export const qinshixianThemes = {
  fashion: fashionTheme,
  cozy: cozyTheme,
  chinese: chineseTheme
};

export function getQinshixianTheme(name?: string | null) {
  if (name === "fashion" || name === "chinese") return qinshixianThemes[name];
  return qinshixianThemes.cozy;
}

export const qinshixianThemeNames = Object.keys(qinshixianThemes) as ThemeName[];

export type { QinshixianTheme, ThemeName } from "./types.js";
export { chineseTheme } from "./chineseTheme.js";
export { cozyTheme } from "./cozyTheme.js";
export { fashionTheme } from "./fashionTheme.js";
