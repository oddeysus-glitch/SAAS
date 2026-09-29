# AI SaaS Platform

One stack. Multiple AI products. Built to sell.

This repository is the foundation for a family of AI products you can launch under your own name.

## What this is

- A shared Next.js 14 App Router SaaS base
- Prisma + PostgreSQL
- Google OAuth
- PayPal/Venmo payment flow
- One free preview per user, then paid access
- Automated research, copy, support, and analytics tooling

## What is in this repo right now

- AI Headshot Generator
- AI Blog Writer

These are the first two products in the system.

## What the system is meant to become

A prospecting platform for AI products you can clone, brand, and sell.

That means:
- one shared billing and account layer
- one shared auth and credit system
- one shared admin and support flow
- many products on top
- one place to find buyers and close them

## Quick start

1. Copy `.env.example` to `.env`.
2. Set your real credentials.
3. Run:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm dev
```

## Database

See [docs/database.md](docs/database.md).

The schema is the source of truth.
PostgreSQL is the database.
The app does not care which managed Postgres you use.

## Payments

This system uses PayPal and Venmo, not Stripe.

Buyers:
1. Sign in.
2. Try a free preview.
3. Pay with PayPal or Venmo.
4. Come back and request access.
5. Get credits after the payment is confirmed.

Owner:
1. Watch the admin panel for payment requests.
2. Confirm the payment.
3. Grant credits.

## Products

Each product shares:
- auth
- accounts
- credits
- jobs
- results
- admin
- support
- analytics

Each product differs in:
- what it generates
- how the buyer uses it
- the pricing and offer

## Prospecting platform

See [docs/prospecting.md](docs/prospecting.md).

This system is not just a pair of apps.
It is a repeatable way to:
- build AI products
- sell them
- keep the buyer in one account
- add more products later

## Owner setup

You will need:
- a PostgreSQL database
- Google OAuth credentials
- a PayPal payment link or Venmo handle
- an AI provider for generation

## Goals

The goal is simple:
- get buyers in
- let them preview
- let them pay
- make the result easy to use
- make support and admin manageable
- make it easy to add the next product

## License

This project is intended as your own sellable system.
Replace the branding, pricing, and products as needed.
