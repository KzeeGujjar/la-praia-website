---
name: scaffold-site
description: Bootstrap and launch the "1st AI new website" project on a Next.js + Tailwind CSS stack. Use this whenever the user asks to scaffold, initialize, set up, start, or launch this website, or asks "how do I get this project running" — even if they don't name the framework explicitly, since this project has already standardized on Next.js + Tailwind. Also use it if the project folder is empty or missing package.json and the user wants to start building.
---

# Scaffold the 1st AI Website

This project has standardized on **Next.js + Tailwind CSS**. When the user asks to scaffold, initialize, or launch the site, follow this workflow rather than improvising a different stack.

## Why this matters

The stack decision was made once so it doesn't need to be re-litigated on every session. Defaulting quietly to Next.js + Tailwind (instead of asking again) keeps the project consistent and saves the user from repeating themselves.

## Workflow

1. **Check current state first.** Look for `package.json` in the project root. If it already exists, the project has already been scaffolded — read it to understand what's there instead of re-running create scripts, and skip to step 4 (running the dev server) or make the specific change the user asked for.

2. **Scaffold with `create-next-app`** if `package.json` does not exist:

   ```bash
   npx create-next-app@latest . --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

   Run this from the project root (the directory containing this `.claude` folder). Use `--use-npm` (or the user's preferred package manager flag) if prompted and no preference is known.

3. **Update the project docs once scaffolding completes.** The root [README.md](../../README.md) and [CLAUDE.md](../../CLAUDE.md) currently contain `TODO` placeholders for tech stack, folder structure, and commands. Fill those in now that the real structure exists — e.g. document `npm run dev`, `npm run build`, `npm run lint`, and the actual `src/app` layout. Don't leave stale placeholders once real answers are available.

4. **Run the dev server** to confirm it works:

   ```bash
   npm run dev
   ```

   Then check it in a browser (e.g. via the preview/browser tool if available) before telling the user it's ready — don't claim success without having actually seen the page load.

## Notes

- If the user explicitly asks for a different stack for a *new, separate* project, don't force Next.js — this skill is scoped to this specific site.
- Keep scaffolding minimal on the first pass: get the default Next.js + Tailwind starter running, then let subsequent requests drive real pages/components/content.
