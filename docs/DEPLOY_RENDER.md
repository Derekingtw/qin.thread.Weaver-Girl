# Render Deployment

## Separation From OA

Qinshixian must be fully isolated from the existing OA system:

- Do not share Render services.
- Do not share `DATABASE_URL`.
- Do not share Redis / Key Value.
- Do not share environment groups.
- Do not share database schemas.
- Do not deploy to OA API, web, or admin domains.
- Do not overwrite an OA `render.yaml`.

## Names

- API service: `qinshixian-api-prod`
- Web service: `qinshixian-web-prod`
- Admin static site: `qinshixian-admin-web-prod`
- Postgres: `qinshixian-postgres-prod`
- Key Value: `qinshixian-keyvalue-prod`
- Environment group: `qinshixian-prod-env`

This repo currently uses `render.yaml` because no OA blueprint exists in this repo. If OA config is ever added, keep it untouched and move Qinshixian to `render.qinshixian.yaml`.

## Architecture

- `apps/api`: NestJS REST API, Render Web Service.
- `apps/web`: buyer and knitter H5 / PC site, Render Web Service.
- `apps/admin-web`: company admin console, Render Static Site.
- Database: Render Postgres, Prisma `provider = "postgresql"`.
- Key Value: Render Key Value via `REDIS_URL`.

Redis / Key Value is only for OTP, rate limit, sessions, and short-term cache. Users, orders, payments, settlements, and other core records stay in Postgres.

## Environment

Set secrets in `qinshixian-prod-env`:

- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `PHONE_HASH_SALT`
- `MOCK_SMS_CODE`
- `MOCK_PAYMENT_AUTO_PAID=false`
- `OBJECT_STORAGE_PROVIDER`
- `MEDIA_MAX_SIZE_MB`
- `CORS_ORIGINS`

`DATABASE_URL` must come from `qinshixian-postgres-prod`. `REDIS_URL` must come from `qinshixian-keyvalue-prod`.

Admin Web must have:

```text
VITE_API_BASE_URL=https://qinshixian-api-prod.onrender.com
```

Web must have:

```text
NEXT_PUBLIC_API_BASE_URL=https://qinshixian-api-prod.onrender.com
WEB_API_BASE_URL=https://qinshixian-api-prod.onrender.com
```

API CORS should include:

```text
CORS_ORIGINS=https://qinshixian-web-prod.onrender.com,https://qinshixian-admin-web-prod.onrender.com
```

API health check path is `/health`.

## Migrations And Seed

Deploy uses:

```bash
npx prisma migrate deploy
```

Seed is manual only:

```bash
npx prisma db seed
```

Do not run seed automatically on every Render deploy because it resets demo data.

## Images

The initial homepage Hero image is served from:

```text
apps/web/public/brand/hero-qinshixian-yarn.png
```

Production uploads must not rely on Render local filesystem. First version supports URL input and mock upload. Formal upload should connect S3, Cloudflare R2, Tencent COS, or Aliyun OSS through the `ObjectStorageProvider` interface.

Storage environment keys:

- `OBJECT_STORAGE_PROVIDER=mock | local-dev | s3 | r2 | cos | oss`
- `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_BASE_URL`
- `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL`
- `COS_BUCKET`, `COS_REGION`, `COS_SECRET_ID`, `COS_SECRET_KEY`, `COS_PUBLIC_BASE_URL`
- `OSS_BUCKET`, `OSS_REGION`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`, `OSS_PUBLIC_BASE_URL`

If production still uses `OBJECT_STORAGE_PROVIDER=mock`, the admin upload API shows a warning. Use URL input or configure object storage before storing real production images at scale.

## Domains

Use Qinshixian-only domains, for example:

- API: `api.qinshixian.example`
- Web: `www.qinshixian.example`
- Admin: `admin.qinshixian.example`

Never point Qinshixian to OA API or admin domains.

## Rollback And Backup

- Roll back web/admin by redeploying a previous Render deploy.
- Roll back API by redeploying the previous successful deploy; review migrations before DB rollback.
- Enable Render Postgres backups before production launch.
- Test restore into a separate database, never the OA database.
