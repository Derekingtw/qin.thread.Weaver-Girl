# UI Guide

## Brand

Qinshixian should feel minimal, warm, trustworthy, lightly technical, and premium handmade. Avoid cheap marketplace styling, cartoon styling, and heavy neon technology styling.

Core colors:

- Background: `#FAF7F2`
- Primary: `#3F766F`
- Warm copper: `#C48969`
- Surface: white or warm white

## Logo

Header left uses the Qinshixian logo only. Do not show `織物平台` as a brand label.

## Hero

Hero image path:

```text
/brand/hero-qinshixian-yarn.png
```

Do not overlay the completed-commission stat card unless `show_hero_stat_card = true`. If shown, place it so it does not cover the brand card inside the photo.

All homepage images use fallback behavior to avoid broken images.

## Login / Register

Auth UI uses a warm white page background and a white/warm card. Main color is `#3F766F`, accent is `#C48969`, and controls are touch-friendly.

Auth entry supports:

- Login tab
- Register tab
- Buyer identity card
- Knitter identity card

Knitter registration uses a five-step visual stepper:

1. Phone verification
2. Basic profile
3. Works and skills
4. Payout and agreements
5. Submitted

Employee invite registration stays on the hidden admin route.

## Header And Mobile

Header left uses the Qinshixian logo only. Do not show `織物平台` as a brand label.

Desktop header order: Qinshixian Logo, 找作品, 秦時線自營, 活動公告, 織女入駐, 秦時線保障, 關於我們, 風格切換, 繁 / 简 / EN, 登入 / 註冊.

Mobile header keeps the first row compact: Logo, 登入, menu. Language and style controls live at the top of the mobile menu. Registration is available in the menu and auth flow, not squeezed into the top bar.

Home mobile cards for announcements, paid promotion, hot works, and Qin selection use horizontal scroll-snap rows. A fixed bottom CTA provides 探索作品 and 開始委託 with safe-area padding.

## About And Guarantee

`/about` should feel like a brand service story, not a generic company profile. Use short sections, cards, value chips, and a strong CTA.

`/guarantee` should feel like a premium service assurance page. Use rule cards, icons, summary chips, and generous spacing. Avoid presenting the content as a dense legal wall.

## Style Theme Toggle

The theme switcher appears near the language switcher on desktop and inside the mobile menu. It must not reload the page. It only changes visual tokens and classes. Logo, routing, and content remain unchanged.
