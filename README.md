# 秦時線 Qinshixian

秦時線是手作委託、織女入駐、平台自營商品與付費推廣的 MVP monorepo。

## Tech Stack

- Monorepo: npm workspaces
- Web: Next.js App Router
- Admin Web: React + Vite + Ant Design
- API: NestJS + Prisma + PostgreSQL
- Cache: Redis / Valkey for OTP, rate limit, session, short cache only

## Local Setup

```bash
npm install
copy .env.example .env
docker-compose up -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev:api
npm run dev:web
npm run dev:admin
```

Local URLs:

- API: http://localhost:4000
- Web: http://localhost:3000
- Admin Web: http://localhost:5173
- Postgres: localhost:5432
- Valkey: localhost:6379

## Hero Image

The Codex attachment has been saved to:

- `apps/web/public/brand/hero-qinshixian-yarn.png`
- `docs/references/hero-qinshixian-yarn.png`

If either file is missing after moving this repo, place the Qinshixian hero image back at `apps/web/public/brand/hero-qinshixian-yarn.png`.

## Seed Accounts

Development OTP: `123456`

- SUPER_ADMIN: `13800000001`
- MARKETING: `13800000006`
- REVIEWER: `13800000002`
- OPS: `13800000003`
- FINANCE: `13800000004`
- CUSTOMER_SERVICE: `13800000005`
- Buyer: `13900000001`
- Pending Knitter: `13900000002`
- Approved Knitter: `13900000003`

## Render

Render deployment is defined in `render.yaml` and uses only Qinshixian names:

- `qinshixian-api-prod`
- `qinshixian-web-prod`
- `qinshixian-admin-web-prod`
- `qinshixian-postgres-prod`
- `qinshixian-keyvalue-prod`
- `qinshixian-prod-env`

Do not reuse OA services, OA `DATABASE_URL`, OA Redis/Key Value, OA env groups, OA domains, or OA `render.yaml`.

See [docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md).

## Current Frontend Pages

- Web: https://qinshixian-web-prod.onrender.com/
- About: `/about`
- Qin Guarantee: `/guarantee`
- Works: `/works`
- Qin Selection: `/platform-products`
- Announcements: `/announcements`

Frontend language options: `繁 / 简 / EN`.

Frontend style options: Fashion, Cozy, Chinese. Cozy is the default. The theme switcher is saved in localStorage and authenticated users can save it through `POST /user/preferred-style`.
