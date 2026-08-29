# La Praia — Website

Frontend-only website for **Ristorante Pizzeria La Praia** (Via Camillo Casarini 10, Bologna), built with Next.js and Tailwind CSS. No backend, database, auth, or payments — all content is static/local data.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project Structure

```
src/
  app/
    page.tsx            # Home
    menu/page.tsx        # Full bilingual menu
    about/page.tsx        # Our story
    contact/page.tsx      # Reservations / hours / map
    layout.tsx            # Fonts, <html lang>, Header/Footer shell
    globals.css            # Tailwind v4 theme tokens (colors, fonts)
  components/            # Header, Footer, LanguageToggle, ContactButtons,
                           # MenuItemRow, MapEmbed, PhotoPlaceholder, WaveDivider
  data/
    business.ts            # Address, phone, hours, delivery zones, map links
    menu.ts                 # Full menu (all categories/items/prices)
  lib/
    language-context.tsx    # IT/EN toggle (React context + localStorage)
    i18n/dictionary.ts      # All UI copy, in Italian and English
```

## Content & Language

- Italian is the default language; English is available via the IT/EN toggle in the header (persisted in `localStorage`).
- Menu item names stay in Italian (the real menu names); ingredient descriptions and category labels translate.
- All business data (menu, prices, hours, address, phone) lives in `src/data/` — update those files directly to change content, no code changes needed elsewhere.

## No Backend, By Design

This is a static frontend: no auth, no database, no server actions, no payment processing. "Reservations" and ordering are handled via `tel:` and WhatsApp (`wa.me`) links to the restaurant's real phone number — there is no online booking system. The project structure (data separated from presentation) makes it straightforward to add a real backend later if needed.

## Photography

No stock photos are used. Sections that would normally show food/interior photography currently render a styled placeholder (`PhotoPlaceholder` component) — swap these for real photos via `next/image` once available.

## Verify Before Publishing

Menu prices, hours, and the phone number were sourced from the restaurant's public listings and are believed accurate as of writing, but should be confirmed with the restaurant before this goes live.
