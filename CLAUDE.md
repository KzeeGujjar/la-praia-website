# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Frontend-only website for **Ristorante Pizzeria La Praia** (Bologna). Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript. No backend: no auth, no database, no admin panel, no payments — with one deliberate exception, see **AI Chat Widget** below. No server-side functionality beyond Next.js's own static rendering and that one API route.

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (react-hooks + next rules)
npx tsc --noEmit # type-check
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

## Verify Before Changing Business Data

Menu prices, hours, and contact info in `src/data/` were sourced from the restaurant's public listings at build time — treat them as needing periodic verification against the real restaurant, not as permanently authoritative.
