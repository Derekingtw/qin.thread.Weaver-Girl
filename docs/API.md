# API

Base URL locally:

```text
http://localhost:4000
```

## Auth

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/register-buyer`
- `POST /auth/register-knitter`
- `POST /auth/employee-register-with-invite`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Development OTP is `123456`.

## User

- `POST /user/preferred-locale`

Body:

```json
{ "locale": "zh-Hant" }
```

or:

```json
{ "locale": "zh-Hans" }
```

## Web

- `GET /web/home`
- `GET /web/announcements`
- `GET /web/platform-products`
- `GET /web/listings`
- `GET /web/listings/:id`

`GET /web/home` returns `homepage_settings.hero_image_url` and `show_hero_stat_card`.

## Admin

- `GET /admin/homepage-settings`
- `PATCH /admin/homepage-settings`
- `GET /admin/announcements`
- `POST /admin/announcements`
- `PATCH /admin/announcements/:id`
- `POST /admin/platform-products`
- `GET /admin/media-assets`
- `POST /admin/media-assets`
- `GET /admin/knitter-applications`
- `POST /admin/knitter-applications/:id/approve`
- `POST /admin/knitter-applications/:id/reject`

Homepage settings write access is limited to `SUPER_ADMIN` and `MARKETING`. `CUSTOMER_SERVICE` can view selected admin data but cannot update homepage Hero image or settings.
