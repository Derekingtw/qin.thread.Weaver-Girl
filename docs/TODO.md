# TODO

- Connect CMS page editing to a full rich-text editor and live API read/write for `about`, `guarantee`, `terms`, and `privacy`.
- Replace MVP mock upload data URLs with real object storage SDK upload before production image volume grows.
- Add homepage settings version history and one-click rollback.
- Add image focal-point crop UI for desktop and mobile previews.
- Complete product/listing multilingual fields beyond fixed UI copy; current MVP keeps listing and product names in original text when API data has no English field.
- Replace mock style settings with production system_settings UI and audit all style changes.
- Add real visual regression screenshots for mobile header, `/about`, and `/guarantee`.
- Connect real object storage: S3 / Cloudflare R2 / Tencent COS / Aliyun OSS.
- Replace mock upload / URL input with real CDN upload.
- Connect real SMS provider.
- Connect real WeChat Pay.
- Connect real Alipay.
- Implement real refunds.
- Add ad scheduling cron.
- Add ad exposure deduplication.
- Add production-grade Redis rate limits.
- If the repo is moved and the Hero image is missing, restore `apps/web/public/brand/hero-qinshixian-yarn.png`.
