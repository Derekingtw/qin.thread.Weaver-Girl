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
