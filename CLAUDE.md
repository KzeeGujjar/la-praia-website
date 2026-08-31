# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Website for **Ristorante Pizzeria La Praia** (Bologna). Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript, with a Postgres/Prisma backend (see **Backend** below) for auth, roles, and admin/reservations features. The public menu display and the chat widget's menu knowledge are both DB-first now (admin-editable, including photos), with the static files in `src/data/` kept only as a same-request fallback if the DB is unreachable and as the seed source — see **Backend**'s "Important split" for exactly what is and isn't DB-driven yet (business hours still aren't). No payments; no order backend for the public chat widget (see **AI Chat Widget**).

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

- **Route groups:** `src/app/(site)/` holds every public, bilingual page (home, about, contact, location, menu, reservation) plus its own layout (`Header`/`Footer`/`MobileActionBar`/`ChatWidget`/`LanguageProvider`/`ThemeLab`). `src/app/admin/` and `src/app/login/` are siblings of `(site)`, **not** inside it, specifically so the back-office UI never inherits the public site's chrome. The root `src/app/layout.tsx` is deliberately minimal (just `<html>/<body>` + fonts) — put public-site-only UI in `(site)/layout.tsx`, not there.
- **Business info (address, phone, hours, delivery zones, Google Maps links) is still static data** in `src/data/business.ts` — update that file for those changes. `src/data/menu.ts` is no longer the live source for the menu (see **Backend**), but stays as the seed source and the DB-outage fallback, so keep it in sync if you're hand-editing menu content outside the admin dashboard.
- **Bilingual (IT default / EN)**: UI copy lives in `src/lib/i18n/dictionary.ts` as a single `dictionaries` object keyed by locale; components consume it via `useLanguage()` from `src/lib/language-context.tsx`. Menu item *names* stay in Italian in all locales (they're the real menu names); only descriptions/categories/UI chrome translate.
- **No stock photography.** Use the `PhotoPlaceholder` component where real photos are pending. Real menu item photos go through the admin dashboard's upload flow (Supabase Storage — see **Menu Images**), not hotlinked stock images.
- **Contact/reservations** are `tel:` and `wa.me` links only (see `ContactButtons.tsx`) — there is intentionally no booking backend.
- Tailwind v4: theme tokens (colors, fonts) are defined in `src/app/globals.css` via `@theme inline` — there is no `tailwind.config.js`.
- Fonts: Fraunces (display/headings) + Inter (body), loaded via `next/font/google` in `src/app/layout.tsx`.

## AI Chat Widget

`src/components/ChatWidget.tsx` is a floating chat bubble (mounted in `layout.tsx`) backed by `src/app/api/chat/route.ts`, a Next.js Route Handler that calls the Anthropic API server-side. This is the one exception to "no backend":

- Requires `ANTHROPIC_API_KEY` set as a server-side env var on the hosting platform (see `.env.example`) — never commit a real key.
- Requires a Node-capable host (e.g. Vercel). It will NOT work with a static export (`output: "export"` in `next.config.ts`) — the route handler needs a running server.
- The system prompt (`src/lib/chat/system-prompt.ts`) is built at request time: menu content is queried live from the DB (falling back to `menu.ts` if that query fails), hours still come from `business.ts` — don't hardcode menu content in the prompt file.
- The bot converses in Italian, English, Spanish, and Urdu (auto-detected per message) — a wider set than the site's own IT/EN UI, which is unchanged. The chat widget's own chrome (buttons, placeholder, canned opening greeting) still follows the site's IT/EN language toggle; only the AI's replies range wider.
- **The bot cannot place orders.** There's still no order backend, so it's instructed to always end an order by directing the customer to confirm it via the existing WhatsApp/phone channels (`ContactButtons.tsx`) — never to claim an order is submitted or confirmed. Preserve this behavior in any prompt edits; it's what keeps the "no booking backend" guarantee true for users.
- This is a public, unauthenticated endpoint that spends real API credits per message — it has basic caps (message count/length, `max_tokens`) but no rate limiting or abuse protection. If this ships to production traffic, consider adding one (e.g. Vercel's rate limiting, or a WAF rule) before relying on it long-term.

## Backend

Postgres via Prisma (`prisma/schema.prisma`), intended for hosting on Supabase or Neon. This is being built incrementally — treat the state below as current, not aspirational, and update this section as each phase lands:

- **Done — "Foundation":** the Prisma schema for all core entities (`User` with `Role` = `SUPER_ADMIN`/`MANAGER`/`STAFF`/`CUSTOMER`, `MenuCategory`/`MenuItem`, `BusinessHours`, `Reservation`, `Order`/`OrderItem`, `RefreshToken`); JWT-based auth (`src/lib/auth/`); and read-only APIs (`/api/menu`, `/api/business/hours`) that serve from the DB.
- **Done — "Reservations":** `/reservation` is a real page (`src/app/reservation/page.tsx` + `src/components/ReservationForm.tsx`) that posts to `POST /api/reservations` (public — guest bookings are allowed; a logged-in customer's `userId` is attached automatically). Validates party size, a sane booking window (30 min–60 days out), and the requested time against `BusinessHours` in the DB (via `src/lib/rome-time.ts`, shared with the chat widget's own hours logic). The old "no online reservations" copy and the `#contact` anchor links for the "reserve" CTAs were updated accordingly; phone/WhatsApp remain as fallback channels for large parties or urgent requests.
- **Done — "Menu + Reservation APIs":** full REST surface for both, detailed below.
- **Done — "Admin dashboard":** `/login` (any role) and `/admin` (gated to `STAFF`/`MANAGER`/`SUPER_ADMIN` by `src/app/admin/layout.tsx`, redirects to `/login` otherwise) — see **Admin Dashboard** below.
- **Done — "Live menu + photos":** the public menu display, the homepage's featured-dishes strip, and the chat widget's menu knowledge all read from the DB now, and `/admin/menu` can attach a real photo to any item — see **Menu Images**.
- **Not done yet:** order-taking (menu → cart → `Order`) API and frontend, and the email/SMS/WhatsApp integrations (Resend, Twilio) an order-confirmation flow would need. Don't assume either exists — check before referencing them.
- **Important split — read this before touching menu or hours code:**
  - **Menu is DB-first with a same-request static fallback.** `src/app/(site)/page.tsx` (`export const dynamic = "force-dynamic"` — deliberate, so `next build` never needs a live `DATABASE_URL`, and so admin edits show up without a redeploy) and `src/lib/chat/system-prompt.ts` both query Prisma directly and catch failures, falling back to `src/data/menu.ts` if the query throws (DB unset, outage, etc.) — see `loadMenu()`/`staticFallback()` in that page and `formatMenu()` in the prompt file. **If you add another place that renders menu content, give it the same try/catch-and-fall-back shape** — don't let a menu-display feature take down a page that used to work with zero backend dependency.
  - **Business hours are still static-only**, in both the site and the chat bot — nothing reads `BusinessHours` from the DB except the reservation-hours check (`src/lib/reservations.ts`) and `/api/business/hours`. This is an intentional asymmetry from the menu, not an oversight; revisit if hours need to become admin-editable too.
  - `prisma/seed.ts` copies `src/data/menu.ts`/`business.ts` *into* the DB so it starts in sync with what those files already shipped. After that, the DB (via `/admin/menu`) is the one to edit for menu changes — hand-editing `menu.ts` now only changes the seed/fallback snapshot, not the live site, unless the DB is unreachable.

### Menu API

Public, read-only, all served from the DB (`src/lib/menu-serialize.ts` for the shared JSON shape) — only `available: true` items/categories are ever returned:

- `GET /api/menu/categories`, `GET /api/menu/items`, `GET /api/menu/items/:id`, `GET /api/menu/category/:slug` (`:slug` is the category's `id`, e.g. `pizze`), `GET /api/menu/search?q=`, `GET /api/menu/featured` (`MenuItem.featured`, seeded from `menuHighlights` in `src/data/menu.ts`).

Admin, gated to `MANAGER`/`SUPER_ADMIN` only — **not** `STAFF`, since front-of-house staff shouldn't be able to change prices or delete items (revisit if that's wrong for how the restaurant actually wants to divide this up):

- `POST /api/admin/menu/categories`, `PUT`/`DELETE /api/admin/menu/categories/:id` (delete cascades to that category's items — see schema).
- `POST /api/admin/menu/items`, `PUT`/`DELETE /api/admin/menu/items/:id`. Deleting an item that's already in a past `Order` is safe: `OrderItem.menuItemId` is `SetNull` on delete, and `nameSnapshot`/`unitPrice` already preserve what was actually ordered.

Validation for both lives in `src/lib/menu-admin.ts`.

### Menu Images

- `POST /api/admin/menu/items/:id/image` (`MANAGER`/`SUPER_ADMIN`, multipart `file` field, JPEG/PNG/WebP only, 5MB cap) uploads to Supabase Storage and sets that item's `imageUrl` in one step — `src/lib/storage.ts` does the upload, gated on `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (service role, not the anon key — see `.env.example`) and a public bucket (`SUPABASE_STORAGE_BUCKET`, defaults to `menu-images`) that you have to create yourself in the Supabase dashboard. Until those are set, uploads fail with a 503 that the admin UI surfaces inline — everything else in the app works fine without them.
- To clear a photo, `PUT /api/admin/menu/items/:id` with `{ imageUrl: null }` — no separate delete endpoint, and the old file is left in Storage rather than being cleaned up (acceptable orphaned-file tradeoff for now, not a correctness issue).
- Rendered wherever a `MenuItem` shows up on the public site (`MenuItemRow`, the homepage's featured strip) via `next/image`; `next.config.ts` allow-lists `*.supabase.co/storage/v1/object/public/**` in `images.remotePatterns` — extend that if you switch image hosts.

### Reservation API

Customer-facing (`src/lib/reservations.ts` has the shared validation/hours-check):

- `POST /api/reservations` — public. Returns a `confirmationCode` (8 chars, ambiguous characters excluded) the guest needs to look up or change the booking later, since there's no login requirement.
- `GET /api/reservations/:id?code=...`, `PUT /api/reservations/:id` (body needs `confirmationCode`), `DELETE /api/reservations/:id?code=...` — a matching `confirmationCode` **or** a staff session authorizes these; anyone else gets 403. `PUT` only works while `status` is still `PENDING` (once staff have touched it, further changes go through staff); `DELETE` sets `status: CANCELLED` rather than removing the row, so the confirmation code and history keep working.

Staff-only (`STAFF`/`MANAGER`/`SUPER_ADMIN`), separate from the customer routes above:

- `GET /api/admin/reservations` (filter by `?status=` or `?date=YYYY-MM-DD`), `PUT /api/admin/reservations/:id/status` (body `{ status }`, one of `PENDING`/`CONFIRMED`/`SEATED`/`COMPLETED`/`CANCELLED`/`NO_SHOW`).

### Admin Dashboard

- `src/app/login/page.tsx` is a single sign-in form for every role (not just staff — a `CUSTOMER` can use it too, it just redirects to `/` instead of `/admin`). It posts to the existing `/api/auth/login` and reads `role` back from that response to decide where to send the user.
- `src/app/admin/layout.tsx` is the only access check: `requireRole("STAFF", "MANAGER", "SUPER_ADMIN")`, redirecting to `/login` on failure. Pages under `/admin/*` read straight from `prisma` as server components (no need to fetch their own API) and only call the `/api/admin/*` routes from client components for writes (create/update/delete), then `router.refresh()`.
- `src/app/admin/menu/page.tsx` re-checks `MANAGER`/`SUPER_ADMIN` itself (rendering a "not allowed" message otherwise) since the nav only *hides* that link for `STAFF` — hiding a link is not access control, and the layout's check alone would let a `STAFF` user hit the page directly.
- `src/components/admin/AdminNav.tsx` polls `POST /api/auth/refresh` every 10 minutes on a `setInterval` purely to stop the 15-minute access-token TTL from bouncing an actively-working staff member to `/login`. If you change that TTL, reconsider whether this is still needed.
- No customer-facing account pages exist yet (no "my reservations" page, no registration form) — `/login` and `POST /api/auth/register` are the only pieces in place for the `CUSTOMER` role today.

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
5. Optionally, for menu photo uploads: create a public bucket in the same Supabase project's Storage tab, then set `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (see **Menu Images**). Everything else works without this step.

### Known gap

`npm audit` currently reports 3 high-severity findings, all from `deepmerge-ts` (via `@prisma/config`, a dependency of the `prisma` CLI itself — not `@prisma/client`, so it isn't part of the deployed runtime bundle). The stack-exhaustion issue it flags needs a recursive object graph to trigger, which isn't something request input can reach. No non-major fix is published yet; re-run `npm audit` after bumping the `prisma`/`@prisma/client` pair and drop this note once it's clear.

## Verify Before Changing Business Data

Menu prices, hours, and contact info in `src/data/` were sourced from the restaurant's public listings at build time — treat them as needing periodic verification against the real restaurant, not as permanently authoritative.
