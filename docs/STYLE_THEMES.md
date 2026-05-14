# 秦時線風格系統

秦時線前台支援三種視覺風格：時尚風、溫馨風、中國風。切換透過 ThemeProvider、CSS theme class 與 shared theme tokens 完成，不重新載入整站，不更換內容，也不更換正式 Logo。

實作位置：

- `apps/web/lib/i18n.tsx`: ThemeProvider 與 localStorage 保存
- `apps/web/components/ThemeToggle.tsx`: 前台切換器
- `apps/web/styles/theme.css`: 三風格視覺套用
- `packages/shared/src/themes/`: shared theme token 定義

## 正式 Logo 規範

正式 Logo 由使用者在 Codex 對話提供，直接保存並使用：

- `apps/web/public/brand/qinshixian-logo-main.png`
- `apps/web/public/brand/qinshixian-logo-main-light.png`
- `apps/web/public/brand/qinshixian-logo-main-dark.png`
- `apps/admin-web/public/brand/qinshixian-logo-main.png`
- `docs/references/qinshixian-logo-main.png`

禁止事項：

- 不得重畫 Logo。
- 不得仿製 Logo。
- 不得用文字替代 Logo。
- 不得改字形、圖案或比例。
- 不得使用外部 URL 載入正式 Logo。

允許事項：

- 尺寸適配。
- 留白裁切與透明背景適配。
- light/dark 背景版本適配。

## 時尚風 Fashion

參考圖：`docs/references/fashion-theme-reference.png`

定位：精品感、雜誌感、高級選品店、克制、大留白、高對比、白色背景。

色彩 token：

- background: `#FFFFFF`
- surface: `#FFFFFF`
- primary: `#0F1E1B`
- accent: `#B68A5B`
- textPrimary: `#111111`
- textSecondary: `#666666`
- border: `#E8E2D7`

視覺差異：

- Header 更像精品官網，線條細、陰影低。
- Hero 留白更大，標題更接近雜誌版式。
- CTA 更克制，使用細邊框與深色主按鈕。
- 卡片陰影降低，邊框更細。
- section spacing 更寬，資訊更精簡。

適合：精品毛線、高端成衣、禮盒、秦時線高級系列。

## 溫馨風 Cozy

參考圖：`docs/references/cozy-theme-reference.png`

定位：手作溫度、柔和、家居感、米白暖色、手工生活感。這是秦時線預設主風格。

色彩 token：

- background: `#FAF7F2`
- surface: `#FFFFFF`
- surfaceSoft: `#FFF9F3`
- primary: `#3F766F`
- accent: `#C48969`
- textPrimary: `#2F3437`
- textSecondary: `#6F777C`
- border: `#E9E2D8`

視覺差異：

- Header 柔和、親切。
- Hero 圖與文字節奏更溫暖。
- 卡片圓角與陰影更柔和。
- icon 使用柔和綠與暖銅。
- mobile 卡片滑動保留舒適留白。

適合：手作委託、織女入駐、作品展示、品牌溫度。

## 中國風 Chinese

參考圖：`docs/references/chinese-theme-reference.png`

定位：國風、雅致、書卷感、宣紙感、中式精品感。

色彩 token：

- background: `#F7F1E6`
- surface: `#FFFDF8`
- primary: `#315B4F`
- accent: `#9B3A32`
- gold: `#B58A4A`
- ink: `#24302C`
- border: `#DED2BD`

視覺差異：

- 背景使用淡宣紙肌理。
- 卡片使用細線、低圓角與書卷感邊界。
- 小標籤與 icon 有印章感。
- CTA 加入暗紅與金銅對比。
- Footer 與流程條更像中式品牌服務頁。

適合：品牌故事、節氣活動、國風毛線系列、中式手作專題。

## Mobile 規範

- Header 第一排保持 Logo、登入、選單，不擠壓註冊。
- 風格與語言切換可放入 mobile menu 第一區。
- Hero 手機順序為標籤、主標、副標、CTA、圖片、信任點。
- 活動公告、織女付費推廣、熱門手作委託、秦時線自營選品使用水平 scroll-snap。
- 底部 Sticky CTA 顯示「探索作品」與「開始委託」，支援 iPhone safe area。
