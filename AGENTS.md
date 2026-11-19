# SCM.Museum

React 19 + Vite + Tailwind CSS v4 (Ukrainian-language oral-history research workspace).

## Commands

- `pnpm dev` — dev server on http://localhost:5173
- `pnpm build` — production build to `dist/`
- Deployed on Vercel from `main` (https://scm-museum.vercel.app)

## Structure

- `src/main.tsx` — entrypoint; `src/App.tsx` — shell
- `src/pages/` — Search, Library, Media, shared
- `src/store.tsx`, `src/data.ts`, `src/types.ts`, `src/lib.ts`, `src/ui.tsx`
- `src/index.css` — global CSS and Tailwind v4 import (no tailwind/postcss config needed)

## Styling

Tailwind v4 via `@tailwindcss/vite`. Put global element styles inside `@layer base { ... }` so utilities still override them.
