# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

O'Sun – Voix Animale: booking site for an animal-communication practitioner (Next.js 16 App Router, React 18, TypeScript, Tailwind + DaisyUI). Public content pages pull from Strapi; bookings, clients and slots live in Postgres (Supabase) via Drizzle; admin area behind NextAuth.

**Language**: user-facing text and API messages are in French — keep new UI/API strings in French. Write new code comments in simple English.

## Commands

- `npm run dev` — dev server on http://localhost:4000 (`npm run dev:test` uses `.env.test`)
- `npm run build` / `npm run lint`
- `npm test` — Vitest in watch mode; `npx vitest run` for a single pass
- Single test: `npx vitest run tests/booking.test.ts` or `npx vitest run -t "test name"`
- `npm run test:coverage` — coverage over `lib/**/*.ts` only (exclusions listed in `vitest.config.mts`)
- `npm run drizzle:generate` / `drizzle:migrate` — generate/apply migrations from `src/db/schema.ts` into `drizzle/`. `drizzle.config.ts` reads `.env` via dotenv; to target test/prod DBs, uncomment the relevant `config({ path })` line there.
- `npm run db:seed` / `db:seed:test` — Faker seed (requires `SEED_ALLOWED=true`, never touches `admins`)
- `npm run email` — React Email preview server for `emails/` on port 3001
- Docker: `docker-compose up` → http://localhost:4001

CI (`.github/workflows/main.yml`, PRs to `main`): `npm ci` → build → lint → test. A separate monthly workflow hits `GET /api/cron/cleanup` (auth: `CRON_SECRET`) to delete clients inactive > 2 years (RGPD).

## Architecture

**Path alias**: `@/*` maps to the repo root (not `src/`), so imports look like `@/lib/bookings`, `@/src/db/schema`, `@/utils/logger`.

**Directory roles**
- `app/` — routes. Pages are thin server components: they fetch Strapi content (by slug, `revalidate = 7200`) and render a client component from `src/pageComponents/*Client.tsx`. Metadata comes from `lib/utils/metadata.ts`.
- `app/api/` — REST route handlers. Also holds non-route code: `app/api/strapi/` (Strapi fetchers + block renderer) and `app/api/types/`.
- `lib/` — server-side business logic and DB access (`bookings.ts`, `timeslots.ts`, `clients.ts`, `form-data.ts`, `lib/admin/*`), Zod schemas (`lib/validation/`), auth (`lib/auth/`), email senders (`lib/email/`), in-memory rate limiters (`lib/security/rate-limit-simple.ts`).
- `src/` — UI: `components/`, `pageComponents/`, `hooks/` (booking form/timer logic), `context/`, plus the DB layer in `src/db/` (`index.ts` exports the Drizzle `db` and `DbTransaction` type; `schema.ts`).
- `utils/` — `logger.ts` (winston) and `withErrorHandler.ts`.
- `emails/` — React Email templates sent through Resend.

**API route conventions**
- Wrap handlers in `withErrorHandler(request, async () => …)` (`utils/withErrorHandler.ts`). It maps `ZodError` → 400, `HttpError(status, msg)` → that status, `AdminBusinessError` → 400 `{ message }`, anything else → 500. Throw these from `lib/` instead of building error responses manually.
- Validate bodies with Zod schemas from `lib/validation/` (`schema.parse(body)`).
- Public endpoints apply `apiRateLimiter.check(ip)`; form submissions verify a Cloudflare Turnstile token.
- Each route carries a `@swagger` JSDoc block; `app/api/swagger/route.ts` builds the OpenAPI spec from `app/api` and `/api-docs` renders it. Update the JSDoc when changing a route's contract.

**Auth / admin protection** (two layers)
1. `proxy.ts` (Next 16 middleware) redirects unauthenticated requests on `/admin`, `/api/admin`, `/api-docs`, `/api/swagger` to `/login`.
2. Admin route handlers are also wrapped in `withAdminAuth` (`lib/auth/with-admin-auth.ts`) as defense in depth — keep both when adding admin routes.

NextAuth v5 (`lib/auth/auth.ts`) uses Credentials (argon2 against the `admins` table, rate-limited) plus Google when env vars exist. Password reset is a server action in `lib/actions/password-reset.ts`.

**Booking flow**
1. `GET /api/booking/timeslots` lists available slots.
2. `POST /api/booking/reserve` locks a slot by setting `time_slots.lockedAt` inside a transaction with `SELECT … FOR UPDATE`. A lock is valid for 15 minutes; expired locks count as free.
3. Client fills the form (timer UI in `useBookingTimer`); `POST /api/booking/release-slot` frees the lock on abandon.
4. `POST /api/booking/confirm` runs one `db.transaction` that checks the lock, creates/updates the client, inserts `form_data` and the booking, then sends confirmation emails.

Admins confirm/cancel bookings and manage slots via `/api/admin/*`.

**Database**: all tables live in the Postgres schema `booking` (`pgSchema("booking")`; drizzle-kit `schemaFilter: ["booking"]`). Tables: `admins`, `clients`, `time_slots`, `form_data`, `bookings`, `password_reset_tokens`. Write migrations to be additive where possible — Vercel rollbacks don't revert applied migrations.

## Testing

Tests live in `tests/` (Vitest, `globals: true`, node env). They don't hit a real DB: they `vi.mock("@/src/db/index", …)` with chainable mocks, and use `createMockTransaction()` / `asTrx()` and `createRequest()` from `tests/utils/test-utils.ts`. Route-level tests (e.g. `booking-confirm.integration.test.ts`) import the route's `POST` directly and mock only external deps (Turnstile, email validation, rate limiter, Resend).

## Git conventions

GitHub Flow: branch per change off `main`, PR with CI green. Commits use Gitmoji (e.g. `✨ Add …`, `🐛 Fix …`, or the `:arrow_up:` shortcode form seen in history).
