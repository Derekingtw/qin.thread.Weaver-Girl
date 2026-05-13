# AGENTS.md

## Project

This repository is the Qinshixian project. It must stay separate from any OA system deployment, database, Redis/Key Value, environment group, Render service, and domain.

## Working Rules

- Make incremental changes only. Do not remove existing core features unless explicitly requested.
- Do not overwrite an OA `render.yaml`. If an OA blueprint is ever present in this repo, create or update `render.qinshixian.yaml` instead.
- Qinshixian Render services must use the `qinshixian-` prefix.
- Production Prisma must use PostgreSQL.
- Render production uploads must not depend on the Render local filesystem.
- Keep user phone numbers out of plaintext database columns. Use `phone_hash` for lookup and `phone_encrypted` for encrypted storage.

## Verification

Before handing off substantial changes, run:

```bash
npx prisma validate
npx prisma generate
npm run build
npm run test
```
