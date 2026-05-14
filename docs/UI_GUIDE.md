# UI Guide

## Brand

秦時線應該呈現簡約、溫暖、可信任、帶一點科技感的高級手作服務。避免廉價商城風、可愛卡通風與過度霓虹科技風。

核心預設色：

- Background: `#FAF7F2`
- Primary: `#3F766F`
- Warm copper: `#C48969`
- Surface: white or warm white

## Logo

Header 左側只能使用秦時線正式 Logo 圖，不顯示「織物平台」或文字替代品牌。

正式 Logo 路徑：

- `apps/web/public/brand/qinshixian-logo-main.png`
- `apps/web/public/brand/qinshixian-logo-main-light.png`
- `apps/web/public/brand/qinshixian-logo-main-dark.png`

Logo 只允許做尺寸、留白與 light/dark 背景適配，不得重畫、仿製、改字形或改圖案。

## Hero

Hero image path:

```text
/brand/hero-qinshixian-yarn.png
```

不要顯示「已完成委託」統計浮層，除非 `show_hero_stat_card = true`。若顯示，位置不得遮擋圖片中的秦時線品牌卡片。

所有首頁圖片都使用 fallback 行為，避免破圖。

## Login / Register

Auth UI 使用暖白背景與白色或淡暖白卡片。主色 `#3F766F`，輔助色 `#C48969`，手機版控制項需容易點擊。

Auth entry 支援：

- Login tab
- Register tab
- Buyer identity card
- Knitter identity card

Knitter registration 使用五步 stepper：

1. Phone verification
2. Basic profile
3. Works and skills
4. Payout and agreements
5. Submitted

員工邀請碼註冊保留在 hidden admin route，不出現在前台主要註冊卡。

## Header And Mobile

Desktop header order: Qinshixian Logo, 找作品, 秦時線自營, 活動公告, 織女入駐, 秦時線保障, 關於我們, 風格切換, 繁 / 简 / EN, 登入 / 註冊.

Mobile header keeps the first row compact: Logo, 登入, menu. Language and style controls live at the top of the mobile menu. Registration is available in the menu and auth flow, not squeezed into the top bar.

Home mobile cards for announcements, paid promotion, hot works, and Qin selection use horizontal scroll-snap rows. A fixed bottom CTA provides 探索作品 and 開始委託 with safe-area padding.

## About And Guarantee

`/about` should feel like a brand service story, not a generic company profile. Use short sections, cards, value chips, cooperation-mode mapper, and a strong CTA.

`/guarantee` should feel like a premium service assurance page. Use rule cards, icons, summary chips, and generous spacing. Avoid presenting the content as a dense legal wall.

## Style Theme Toggle

The theme switcher appears near the language switcher on desktop and inside the mobile menu. It must not reload the page. It changes visual tokens, card rhythm, borders, CTA style, typography feel, section spacing, and decorative treatment. Logo, routing, and content remain unchanged.
