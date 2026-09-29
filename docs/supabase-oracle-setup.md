# Supabase Oracle-style connection note

This note captures the connection pattern you pasted for Supabase.

## Connection strings

```
DIRECT_URL="postgresql://postgres.dkwjinmykgtvnsroumrj:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

DATABASE_URL="postgresql://postgres.dkwjinmykgtvnsroumrj:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

- `DIRECT_URL` is used for migrations.
- `DATABASE_URL` is used by the app at runtime.

## What to do

1. Copy `.env.local.example` to `.env.local`.
2. Replace `[YOUR-PASSWORD]` with the real Supabase database password.
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Start the app:
   ```bash
   pnpm dev
   ```

## Current status

The project already has:
- `prisma/schema.prisma` configured with `url` and `directUrl`
- `.env.local` prepared with the Supabase connection strings
- PayPal keys already in place

What is still missing:
- the real database password in `.env.local`

Once you replace `[YOUR-PASSWORD]`, the database path is ready to push.
