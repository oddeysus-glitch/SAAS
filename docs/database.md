# Database

This system uses PostgreSQL.
The schema lives in `prisma/schema.prisma`.

## What the database stores

- User accounts and login sessions
- Credit balances and credit history
- Jobs and generated results
- Payment requests and ownership events
- Analytics and support events

## Local development

If you have a local PostgreSQL database, set this in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_saas_platform
```

Then run:

```bash
pnpm db:generate
pnpm db:push
```

`db:push` is for quick local setup.
For production or team use, use migrations.

## Migrations

To create a migration after changing the schema:

```bash
pnpm db:migrate
```

Commit the resulting migration files in `prisma/migrations`.

## GitHub workflow

This repo is the source of truth for the schema.
When you deploy from GitHub:

1. Create a managed PostgreSQL database.
2. Add `DATABASE_URL` as a secret in the deployment environment.
3. Run schema setup as part of deploy or container startup.

## Managed Postgres options

Use whichever managed Postgres you prefer, for example:

- Neon
- Supabase
- Railway
- Render
- DigitalOcean Managed Database
- AWS RDS

The app does not care which one you use.
It only needs a working `DATABASE_URL`.

## Do not commit secrets

Never commit `.env` or real credentials.
Keep `.env` local and add secrets in your hosting environment.
