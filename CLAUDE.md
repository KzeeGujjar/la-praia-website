# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Frontend-only website for **Ristorante Pizzeria La Praia** (Bologna). Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript. No backend: no auth, no database, no admin panel, no payments, no server-side functionality beyond Next.js's own static rendering.

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

## Verify Before Changing Business Data

Menu prices, hours, and contact info in `src/data/` were sourced from the restaurant's public listings at build time — treat them as needing periodic verification against the real restaurant, not as permanently authoritative.
