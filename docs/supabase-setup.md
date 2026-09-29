# Supabase Postgres Setup

This is the fastest way to get the system onto a real Postgres database.

## 1. Create the project

1. Go to https://supabase.com and sign in.
2. Click **New Project**.
3. Name it something simple, like `saisaas-platform`.
4. Set a strong database password and save it.
5. Pick a region close to where your buyers are.
6. Wait for the project to finish provisioning.

## 2. Get the connection strings

From your Supabase project, use:

- **Direct URL** (for migrations): `postgresql://postgres.[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres`
- **Pooler URL** (for app runtime): `postgresql://postgres.[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true`

In `.env.local`:

```
DIRECT_URL="postgresql://postgres:%5BYOUR-ENCODED-PASSWORD%5D@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
DATABASE_URL="postgresql://postgres:%5BYOUR-ENCODED-PASSWORD%5D@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

- `DIRECT_URL` is used by Prisma for migrations.
- `DATABASE_URL` is used by the app at runtime.
- If your password has special characters, percent-encode them in the URL.

## 3. Install the Supabase CLI and link the project

```bash
npm install -g supabase
supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
```

## 4. Generate and push the migration

```bash
# Generate migration SQL from Prisma schema
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --to-url "$DATABASE_URL" --script --output supabase/migrations/001_init.sql

# Push to Supabase
npx supabase db push --project-ref YOUR-PROJECT-REF
```

This creates these tables in Supabase:
- User
- Account
- Session
- VerificationToken
- Plan
- CreditLedger
- Job
- PreviewCount
- Event
- BillingRequest
- PayoutRequest
- Result

## 5. Generate the Prisma client

```bash
npx prisma generate
```

## 6. Test the connection

Start the app:

```bash
pnpm dev
```

Then:

1. Open `/account`, `/billing`, `/admin`, or any product page.
2. Confirm the app loads without a database connection error.

If it fails, the usual causes are:
- the password was not replaced in `.env.local`
- the Supabase project is not finished provisioning yet
- local access is blocked by Supabase connection settings
- the password was changed after the URL was copied

## 7. If local access is blocked

Supabase can restrict database access. If the app fails to connect from localhost:

1. Open **Database** in Supabase.
2. Check whether you need to allow local connections or use a different connection mode.
3. Use the connection string that Supabase gives you for your current setup.

## 8. What this gets you

Once this is live, the app can store:
- accounts
- credits
- jobs
- results
- billing requests
- payout requests
- admin records

It does not by itself create PayPal payouts or automate money movement. It gives you a real database behind the system so the rest of the flow actually persists.

## 9. Project-specific values

For this project:
- **Project Ref**: `dkwjinmykgtvnsroumrj`
- **Region**: `aws-0-us-east-2`
- **Database host**: `db.dkwjinmykgtvnsroumrj.supabase.co:5432`
- **Pooler host**: `aws-0-us-east-2.pooler.supabase.com`

## 10. What to do next

After the database is live:
1. Confirm sign-in works if you enabled Google OAuth.
2. Test the billing request flow at `/billing`.
3. Confirm you can see requests in `/admin`.
4. Then decide whether the founder payout path should stay manual confirmation for now or move to a real PayPal payout integration later.
