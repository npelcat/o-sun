# O'Sun – Voix Animale

Booking platform for a self-employed animal communication practitioner: service pages, an online booking flow, and an admin area for managing appointments and availability.

Live: https://www.osun-voixanimale.com/

## Contents

1. [Features](#1-features)
2. [Tech stack](#2-tech-stack)
3. [Getting started](#3-getting-started)
4. [Database](#4-database)
5. [Testing](#5-testing)
6. [Security](#6-security)
7. [RGPD data deletion](#7-rgpd-data-deletion)
8. [Deployment](#8-deployment)
9. [Git workflow](#9-git-workflow)

## 1. Features

**Client**

- Service, ethics and testimonial pages
- Booking flow: pick a slot, fill a detailed form
- Contact form with automatic confirmation email
- Legal notices / T&Cs

**Admin**

- Google OAuth login via NextAuth
- View, confirm, cancel bookings, add private notes
- Slot management (create/edit/disable)

**API**

- REST endpoints, documented with Swagger at `/api-docs`
- Zod validation on both client and server

## 2. Tech stack

| Layer    | Choices                                                        |
| -------- | -------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind + DaisyUI |
| Backend  | Next.js API routes, PostgreSQL (Supabase), Drizzle ORM, Zod    |
| Services | Strapi CMS (Koyeb), Resend (email), NextAuth (Google OAuth)    |
| Tooling  | Docker, Vitest, Swagger, GitHub Actions                        |

## 3. Getting started

**Prerequisites:** Node 22+, npm (or pnpm), Docker (optional)

```bash
git clone https://github.com/npelcat/o-sun.git
cd o-sun
cp .env.example .env.local   # fill in the values below
```

**Without Docker** — `npm install && npm run dev` → http://localhost:4000
**With Docker** — `docker-compose up` → http://localhost:4001

**Environment variables** (`.env.local`)

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=

NEXT_PUBLIC_API_URL=http://localhost:1337        # Strapi

DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

RESEND_API_KEY=
RESEND_SENDER_EMAIL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CRON_SECRET=            # RGPD cleanup job, see §7
CRON_DATABASE_URL=
```

**Scripts**

| Command                                        | What it does                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run dev` / `build` / `start`              | Standard Next.js lifecycle                                                                       |
| `npm run test`                                 | Run the Vitest suite                                                                             |
| `npm run lint`                                 | ESLint                                                                                           |
| `npm run drizzle:generate` / `drizzle:migrate` | Create / apply DB migrations                                                                     |
| `npm run db:seed` / `db:seed:test`             | Seed local or test DB with fake data (Faker) — requires `SEED_ALLOWED=true`, never in production |

## 4. Database

PostgreSQL on Supabase, one instance for production and one for tests, local dev points at a database with sample data. Schema and migrations live under `/drizzle`, managed with Drizzle ORM (see scripts above). The seed script populates clients, slots and bookings — it never touches the `admins` table.

## 5. Testing

```bash
npm run test
```

Unit tests live in `/tests`, written with Vitest.

## 6. Security

- Admin routes protected by NextAuth session checks in middleware
- Zod validation on every input, client and server side
- Secrets never exposed client-side (only `NEXT_PUBLIC_*` vars are)
- Regular dependency audits (Dependabot)

## 7. RGPD data deletion

A GitHub Actions cron runs monthly (1st, 2am UTC) and deletes client accounts inactive for over two years, cascading to their bookings and form data.

- Route: `GET /api/cron/cleanup`, authenticated with `CRON_SECRET`
- Manual run: GitHub → Actions → "Suppression automatique des données RGPD"
- A response of `{"success":true,"deletedCount":0}` is normal — it just means nothing was old enough

## 8. Deployment

Hosted on Vercel, with Strapi on Koyeb and email via Resend.

To roll back: Vercel → Deployments → pick the last stable one → Redeploy. This only reverts the app code — a database migration already applied stays applied, which is why migrations are written to be additive (new columns, not dropped ones) whenever possible.

## 9. Git workflow

- **Branching** — GitHub Flow: `main` is always deployable, one `feature/*` branch per change, merged via PR once lint/build/tests pass in CI. Direct pushes to `main` are blocked.
- **Commits** — [Gitmoji](https://gitmoji.dev/), e.g. `✨ Add booking form with Zod validation`, `🐛 Fix slot not releasing after timeout`.
- **Releases** — SemVer (`vMAJOR.MINOR.PATCH`): patch for fixes, minor for features, major for breaking changes. Tag from `main` and publish a GitHub release.

---

**@nad_cat** — [LinkedIn](https://www.linkedin.com/in/nadege-pelcat)
Private license, all rights reserved.
