# Qinshixian Spec

## Product

秦時線 is a warm, minimal, technology-enabled handmade commission service. It supports buyers, knitters, employee admin, Qin selection products, announcements, and three paid knitter promotion slots.

Frontend copy should use「秦時線」as the main subject. Formal rules and contracts may still use「平台」when it is the accurate legal or policy term.

## OA Separation

秦時線 must not share OA Render services, `DATABASE_URL`, Redis / Key Value, env groups, database schema, domains, or blueprint content. All production names use the `qinshixian-` prefix.

## Homepage

Homepage sections:

1. Header
2. Hero Section
3. Process trust strip
4. Announcements
5. Three fixed paid knitter promotion slots
6. Hot handmade commissions
7. Qin selection products
8. Cooperation modes
9. Knitter CTA
10. Footer

Hero image default:

```text
/brand/hero-qinshixian-yarn.png
```

`homepage_settings.show_hero_stat_card` defaults to `false`. The stat card is hidden unless admin turns it on.

## Official Logo

The official logo comes from the Codex attachment and is used directly:

- `apps/web/public/brand/qinshixian-logo-main.png`
- `apps/web/public/brand/qinshixian-logo-main-light.png`
- `apps/web/public/brand/qinshixian-logo-main-dark.png`
- `apps/admin-web/public/brand/qinshixian-logo-main.png`

Do not redraw, imitate, replace with text, or alter the logo lettering.

## Locale

Default locale is `zh-Hant`. Users can switch between `zh-Hant`, `zh-Hans`, and `en`; preference is saved in localStorage/cookie and, if logged in, via `POST /user/preferred-locale`.

Fixed UI copy supports English. CMS-style fields include Traditional, Simplified, and English variants. Missing Simplified or English content falls back to Traditional content.

## Theme System

Frontend supports three selectable styles:

- `fashion`: boutique, magazine-like, white background, high contrast, reduced shadows.
- `cozy`: warm handmade default, soft green, warm copper, rounded cards.
- `chinese`: refined Chinese style, paper texture, ink green, dark red, gold copper, fine borders.

Preference is saved in `localStorage` as `qinshixian_style`; authenticated users can save it to `users.preferred_style` through `POST /user/preferred-style`. Shared tokens live under `packages/shared/src/themes/`.

## About

`/about` includes:

- Brand story
- What Qin Thread does
- Buyer value
- Knitter value
- Three cooperation modes
- Values
- CTA

Frontend pages must not display raw enum codes such as `COMMISSION_5`, `PLATFORM_BUYOUT_SERVICE`, or `READY_MADE_TO_PLATFORM`. Cooperation modes go through a display mapper with Traditional Chinese, Simplified Chinese, and English labels.

## Qin Guarantee

`/guarantee` is the formal Qin Guarantee page. Header navigation label is「秦時線保障」.

It covers:

1. 委託前保障
2. 訂金保障
3. 製作中保障
4. 驗收保障
5. 尾款保障
6. 出貨保障
7. 隱私保障
8. 售後與爭議保障
9. 織女審核保障
10. 廣告推廣保障

The page should feel like a premium brand service page with cards, icons, sections, and CTA, not a legal text wall.

## Registration

Public frontend registration supports buyer registration, knitter registration, and phone OTP login. Employee registration is hidden at `/admin/register-with-invite`.

Buyer registration creates user, BUYER role, buyer profile, immutable 8-digit `public_code`, blue role color, ACTIVE status, and TERMS / PRIVACY consent logs.

Knitter registration creates user, KNITTER role, knitter profile, immutable 8-digit `public_code`, purple role color, encrypted payout account, TERMS / PRIVACY consent logs, and `PENDING_REVIEW` status. Pending knitters cannot publish works or apply for ads.

Phone number lookup uses `phone_hash`; encrypted value uses `phone_encrypted`; no plaintext phone column is used.

## Paid Promotion

Homepage has exactly three knitter promotion slots. Ads must be paid with `payment_type = AD_FEE`; ad fees are Qin Thread revenue and do not create knitter settlements. Ad content must not include phone, WeChat, Email, LINE, Telegram, QQ, or external contact information, and should link only to internal listing pages.

## Object Storage

`media_assets` records image/video/file URLs and usage. First version supports fixed public assets, URL input, and mock upload. Production must use object storage rather than Render filesystem.
