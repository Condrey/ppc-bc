## Quick context

- Monorepo root: this is a small Next.js app using the App Router (app/ directory).
- Useful entry points: `app/page.tsx` (root route), `app/layout.tsx` (root layout), `app/globals.css` (global styles).
- Package scripts (see `package.json`): `dev` (next dev), `build` (next build), `start` (next start), `lint` (eslint).

## Architecture notes for an AI coding agent

- Framework: Next.js v16 (App Router). Components under `app/` default to server components unless they include `"use client"`.
- Styling: Tailwind v4 is configured via PostCSS plugin (`postcss.config.mjs` and `tailwindcss` dependency). Global CSS lives in `app/globals.css` and is imported from `app/layout.tsx`.
- Fonts: Google fonts are loaded via `next/font/google` in `app/layout.tsx` (see `Geist` and `Geist_Mono` usage). Avoid replacing with external link tags — prefer `next/font` for optimization.
- Assets: Static images live in `public/` and are referenced with paths like `/next.svg` in `app/page.tsx` using `next/image`.
- TypeScript: `tsconfig.json` uses `strict: true` and a path alias `@/* -> ./*`. Honor these when adding imports.

## Conventions & patterns to follow

- Prefer server components by default. Add `"use client"` only where client-side interactivity or hooks are required.
- Keep top-level layout and metadata in `app/layout.tsx`. Place route-level UI in `app/<route>/page.tsx` or nested folders.
- Use `next/image` for images and `next/font` for fonts (examples in `app/page.tsx` and `app/layout.tsx`).
- Linting: `eslint` is configured via `eslint.config.mjs` (extends Next.js recommendations). Use `npm run lint` to run checks.

## Build / run / debug commands (explicit)

- Start dev server: `npm run dev` (serves at http://localhost:3000)
- Build for production: `npm run build`
- Start built app: `npm run start`
- Lint: `npm run lint`

Note: There is no test runner configured in `package.json`; do not assume Jest/Playwright exist unless you add them and update the manifest.

## Integration points & deployment

- Intended deployment: Vercel (readme mentions Vercel templates). Keep Next-specific optimizations intact (image optimization, next/font).
- External services: none configured in repo files; avoid introducing environment-dependent code without adding `.env` handling and documenting secrets.

## Files to inspect when changing behavior

- `package.json` — scripts & deps
- `app/layout.tsx` — global layout, fonts, globals.css import
- `app/page.tsx` — example route component and usage of `next/image`
- `postcss.config.mjs` and Tailwind plugin — Tailwind integration
- `eslint.config.mjs` — linting rules and global ignores
- `tsconfig.json` — path aliases and strict settings

## Example small tasks and how to implement them

- Add a new route `/about`: create `app/about/page.tsx` and (if needed) `app/about/layout.tsx`. Use server components by default. Import styles from `globals.css` or create a local `about.css` and import from the component.
- Add a client-only interactive component: create `app/components/Widget.tsx` with `"use client"` at top, use React hooks, then import into a page.

## Safety & change rules

- Do not upgrade major framework versions (Next/React) without explicit human approval. Changes to `package.json` must update `devDependencies` and be minimal.
- Keep CI/build script changes explicit and small. If adding new scripts (tests, format), add them to `package.json` and document in `README.md`.

---

If anything above is unclear or you need more detail (e.g., preferred import paths, missing scripts to add, or test setup), tell me which area to expand and I will update this file.
e
