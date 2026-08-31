# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Website for **Ristorante Pizzeria La Praia** (Bologna). Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript, with a Postgres/Prisma backend (see **Backend** below) for auth, roles, and future admin/reservations/orders features. The customer-facing frontend itself is still driven by the static files in `src/data/` — it does not yet read from the database (see **Backend** for the current split). No payments; no order backend for the public chat widget (see **AI Chat Widget**).

## Commands

```bash
npm run dev            # dev server (localhost:3000)
npm run build           # production build
npm run start           # serve production build
npm run lint            # eslint (react-hooks + next rules)
npx tsc --noEmit        # type-check
npm run prisma:generate # regenerate the Prisma client after a schema change
npm run prisma:migrate  # create/apply a migration in dev (needs DATABASE_URL)
npm run db:seed         # seed the DB from src/data/*.ts + bootstrap a super admin
```

## Structure & Conventions

- **All content is static data** in `src/data/business.ts` (address, phone, hours, delivery zones, Google Maps links) and `src/data/menu.ts` (full menu). Update these files for content changes — don't hardcode restaurant data inside components.
- **Bilingual (IT default / EN)**: UI copy lives in `src/lib/i18n/dictionary.ts` as a single `dictionaries` object keyed by locale; components consume it via `useLanguage()` from `src/lib/language-context.tsx`. Menu item *names* stay in Italian in all locales (they're the real menu names); only descriptions/categories/UI chrome translate.
- **No stock photography.** Use the `PhotoPlaceholder` component where real photos are pending rather than hotlinking stock images.
- **Contact/reservations** are `tel:` and `wa.me` links only (see `ContactButtons.tsx`) — there is intentionally no booking backend.
- Tailwind v4: theme tokens (colors, fonts) are defined in `src/app/globals.css` via `@theme inline` — there is no `tailwind.config.js`.
- Fonts: Fraunces (display/headings) + Inter (body), loaded via `next/font/google` in `src/app/layout.tsx`.

## AI Chat Widget

`src/components/ChatWidget.tsx` is a floating chat bubble (mounted in `layout.tsx`) backed by `src/app/api/chat/route.ts`, a Next.js Route Handler that calls the Anthropic API server-side. This is the one exception to "no backend":

- Requires `ANTHROPIC_API_KEY` set as a server-side env var on the hosting platform (see `.env.example`) — never commit a real key.
- Requires a Node-capable host (e.g. Vercel). It will NOT work with a static export (`output: "export"` in `next.config.ts`) — the route handler needs a running server.
- The system prompt (`src/lib/chat/system-prompt.ts`) is generated from `business.ts` and `menu.ts` at request time, so menu/hours edits there automatically flow into the bot — don't hardcode menu content in the prompt file.
- The bot converses in Italian, English, Spanish, and Urdu (auto-detected per message) — a wider set than the site's own IT/EN UI, which is unchanged. The chat widget's own chrome (buttons, placeholder, canned opening greeting) still follows the site's IT/EN language toggle; only the AI's replies range wider.
- **The bot cannot place orders.** There's still no order backend, so it's instructed to always end an order by directing the customer to confirm it via the existing WhatsApp/phone channels (`ContactButtons.tsx`) — never to claim an order is submitted or confirmed. Preserve this behavior in any prompt edits; it's what keeps the "no booking backend" guarantee true for users.
- This is a public, unauthenticated endpoint that spends real API credits per message — it has basic caps (message count/length, `max_tokens`) but no rate limiting or abuse protection. If this ships to production traffic, consider adding one (e.g. Vercel's rate limiting, or a WAF rule) before relying on it long-term.

## Backend

Postgres via Prisma (`prisma/schema.prisma`), intended for hosting on Supabase or Neon. This is being built incrementally — treat the state below as current, not aspirational, and update this section as each phase lands:

- **Done — "Foundation":** the Prisma schema for all core entities (`User` with `Role` = `SUPER_ADMIN`/`MANAGER`/`STAFF`/`CUSTOMER`, `MenuCategory`/`MenuItem`, `BusinessHours`, `Reservation`, `Order`/`OrderItem`, `RefreshToken`); JWT-based auth (`src/lib/auth/`); and read-only APIs (`/api/menu`, `/api/business/hours`) that serve from the DB.
- **Done — "Reservations":** `/reservation` is a real page (`src/app/reservation/page.tsx` + `src/components/ReservationForm.tsx`) that posts to `POST /api/reservations` (public — guest bookings are allowed; a logged-in customer's `userId` is attached automatically). Validates party size, a sane booking window (30 min–60 days out), and the requested time against `BusinessHours` in the DB (via `src/lib/rome-time.ts`, shared with the chat widget's own hours logic). `GET /api/reservations` is staff-only (`STAFF`/`MANAGER`/`SUPER_ADMIN`) for listing/filtering by status — there's no admin UI to call it from yet. The old "no online reservations" copy and the `#contact` anchor links for the "reserve" CTAs were updated accordingly; phone/WhatsApp remain as fallback channels for large parties or urgent requests.
- **Not done yet:** an admin dashboard, order-taking (menu → cart → `Order`) API and frontend, updating a reservation's status (confirm/cancel) anywhere but directly in the DB, and the email/SMS/WhatsApp/image-upload integrations (Resend, Twilio, Cloudinary) those flows will eventually need. Don't assume any of these exist — check before referencing them.
- **Important split:** the live frontend still imports menu/hours content directly from `src/data/business.ts` / `src/data/menu.ts`, unchanged — it does **not** call `/api/menu` or `/api/business/hours` (reservations are the one exception: they're DB-native from the start, since there was no prior static equivalent to preserve). `prisma/seed.ts` copies the static menu/hours files *into* the DB so the DB and the static frontend start in sync, but editing the DB after seeding will not change what the menu/hours sections show until the frontend (or an admin flow) is wired to read from the DB instead. Don't assume editing a `MenuItem` row updates the live site.

### Auth

- Access tokens: short-lived (15 min) JWTs signed with `JWT_ACCESS_SECRET`, in an `httpOnly` cookie (`src/lib/auth/tokens.ts`, `src/lib/auth/session.ts`).
- Refresh tokens: opaque random strings, stored only as a SHA-256 hash in the `RefreshToken` table, in a separate `httpOnly` cookie — rotated (old one revoked, new one issued) on every call to `/api/auth/refresh`, so there's no long-lived secret that can be replayed if a DB dump leaks.
- Registration (`/api/auth/register`) always creates a `CUSTOMER`; there is no self-serve way to become `STAFF`/`MANAGER`/`SUPER_ADMIN` — those roles are granted by editing the DB directly (or, once it exists, an admin dashboard). The first `SUPER_ADMIN` is bootstrapped by `prisma/seed.ts` from `SUPER_ADMIN_EMAIL`/`SUPER_ADMIN_PASSWORD`.
- Use `requireRole(...)` from `src/lib/auth/session.ts` to gate a route handler by role; use `getSessionUser()` for "logged in as anyone" checks.

### Setup

1. Create a Postgres DB (Supabase or Neon both work) and set `DATABASE_URL` in `.env.local`.
2. Set `JWT_ACCESS_SECRET` (e.g. `openssl rand -base64 32`).
3. `npm run prisma:migrate` to create the tables.
4. Optionally set `SUPER_ADMIN_EMAIL`/`SUPER_ADMIN_PASSWORD`, then `npm run db:seed` to populate the menu/hours and bootstrap that admin account.

### Known gap

`npm audit` currently reports 3 high-severity findings, all from `deepmerge-ts` (via `@prisma/config`, a dependency of the `prisma` CLI itself — not `@prisma/client`, so it isn't part of the deployed runtime bundle). The stack-exhaustion issue it flags needs a recursive object graph to trigger, which isn't something request input can reach. No non-major fix is published yet; re-run `npm audit` after bumping the `prisma`/`@prisma/client` pair and drop this note once it's clear.

## Verify Before Changing Business Data

Menu prices, hours, and contact info in `src/data/` were sourced from the restaurant's public listings at build time — treat them as needing periodic verification against the real restaurant, not as permanently authoritative.
