# SCM.Museum

React 19 + Vite + Tailwind CSS v4 (Ukrainian-language oral-history research workspace).

## Commands

- `pnpm dev` — dev server on http://localhost:5173
- `pnpm build` — production build to `dist/`
- Deployed on Vercel from `main` (https://scm-museum.vercel.app)

## Structure

- `src/main.tsx` — entrypoint; `src/App.tsx` — shell
- `src/pages/` — Search, Library, Media, shared
- `src/store.tsx`, `src/data.ts`, `src/types.ts`, `src/lib.ts`
- `src/ui.tsx` and `src/components/{Button,Checkbox,Chip,FilterButton,IconButton,LinkButton,Segmented,Tabs}.tsx` — thin re-exports from `@scm/platform`; `src/components/Logo.tsx` is museum-specific
- `src/index.css` — Tailwind v4 import, `@scm/platform/styles/platform.css` (tokens, base, shell, ui, tooltips) and museum's own domain CSS in `src/styles/components/`

## Shared core `@scm/platform`

Private repo `mikelebedenko/scm-platform`, pinned by tag in package.json (sources, no build). Do not copy tokens/base/shell/ui/tooltips/UI-kit locally — change them in the core and bump the tag. Install needs a GitHub token via `git config url.insteadOf` (Vercel `installCommand` in `vercel.json`, CI step); env/secret `PLATFORM_TOKEN`, never commit it.

## Styling

Tailwind v4 via `@tailwindcss/vite`. Put global element styles inside `@layer base { ... }` so utilities still override them.
