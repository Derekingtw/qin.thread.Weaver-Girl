# Qinshixian Spec

## Product

Qinshixian is a warm, minimal, technology-enabled handmade commission platform. It supports buyers, knitters, employee admin, platform-owned products, announcements, and paid knitter promotion slots.

## OA Separation

Qinshixian must not share OA Render services, `DATABASE_URL`, Redis / Key Value, env groups, database schema, domains, or blueprint content. All production names use the `qinshixian-` prefix.

## Homepage

Homepage sections:

1. Header
2. Hero Section
3. Process trust strip
4. Announcements
5. Three fixed paid knitter promotion slots
6. Hot handmade commissions
7. Platform-owned products
8. Cooperation modes
9. Knitter CTA
10. Footer

Hero image default:

```text
/brand/hero-qinshixian-yarn.png
```

`homepage_settings.show_hero_stat_card` defaults to `false`. The stat card is hidden unless admin turns it on.

## Homepage Settings

The admin homepage page can edit badge, slogan, subtitle, CTA text/URLs, Hero image URL, Hero image alt, stat card switch/text, and three trust points. Web reads `/web/home` and falls back to local seed content if the API is unavailable.

## Registration

Public frontend registration supports:

- Buyer registration
- Knitter registration
- Login by phone OTP

Employee registration is hidden at:

```text
/admin/register-with-invite
```

Buyer registration creates user, BUYER role, buyer profile, immutable 8-digit `public_code`, blue role color, ACTIVE status, and TERMS / PRIVACY consent logs.

Knitter registration creates user, KNITTER role, knitter profile, immutable 8-digit `public_code`, purple role color, encrypted payout account, TERMS / PRIVACY consent logs, and `PENDING_REVIEW` status. Pending knitters cannot publish works or apply for ads.

Existing phone rules:

- Existing BUYER cannot register buyer again.
- Existing BUYER can apply for KNITTER.
- Existing KNITTER cannot apply again.
- Existing phone registration shows a login or role-completion message.

Phone number storage:

- Lookup uses `phone_hash`.
- Encrypted value uses `phone_encrypted`.
- No plaintext phone column is used.

## Locale

Default locale is `zh-Hant`. Users can switch to `zh-Hans`; preference is saved in localStorage/cookie and, if logged in, via `POST /user/preferred-locale`.

CMS-style fields include Traditional and Simplified variants. Missing Simplified content falls back to Traditional content.

## Paid Promotion

Homepage has exactly three knitter promotion slots. Ads must be paid with `payment_type = AD_FEE`; ad fees are platform revenue and do not create knitter settlements. Ad content must not include phone, WeChat, Email, LINE, Telegram, QQ, or external contact information, and should link only to internal listing pages.

## Object Storage

`media_assets` records image/video/file URLs and usage. First version supports fixed public assets, URL input, and mock upload. Production must use object storage rather than Render filesystem.
