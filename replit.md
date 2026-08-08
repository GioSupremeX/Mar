# Mar's Artist Portfolio

A dreamy, cat-themed artist portfolio with soft pastel aesthetics, glassmorphism, parallax animations, an editable admin dashboard, and a guestbook. Built for Mar, customized by Giorgosxaral.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **DB schema**: `lib/db/src/schema/` — `artworks.ts`, `guestbook.ts`, `site_settings.ts`
- **API routes**: `artifacts/api-server/src/routes/` — `settings.ts`, `admin.ts`, `guestbook.ts`, `artworks.ts`
- **API contract**: `lib/api-spec/openapi.yaml` — source of truth for all API types
- **Public site**: `artifacts/portfolio/src/pages/home.tsx` + components in `src/components/`
- **Admin dashboard**: `artifacts/portfolio/src/pages/admin-dashboard.tsx`
- **Theme / colors**: `artifacts/portfolio/src/index.css` — light + `.dark` mode CSS vars

## Architecture decisions

- **Contract-first API**: OpenAPI spec drives both Zod validation and React Query hooks via Orval codegen. Always edit `openapi.yaml` first, then run `codegen`.
- **No image BLOBs in DB**: The database only stores metadata. Images are either external URLs (recommended) or Replit Object Storage. Keeps the DB tiny and portable.
- **Single `site_settings` table**: All editable content (artist name, bio, toggles, social links, games, trophies, etc.) lives as key-value rows. This makes the admin dashboard fully generic — no schema migrations needed to add new editable fields.
- **Admin auth via bcrypt + JWT**: Password hash stored in `site_settings.adminPasswordHash`, survives restarts. Brute-force protection with attempt limiting and cooldowns.
- **Dark mode via CSS variables**: `.dark` class toggles on `<html>`. All components read from CSS custom properties — no JS theme objects needed.

## Product

- Public portfolio with parallax orbs, floating particles, and cat paw trail cursor effects
- Editable gallery with category filters, lightbox (keyboard navigation), and tilt cards
- Admin dashboard with tabs: Artworks, Site Settings, Page Content, Guestbook, Security
- Guestbook with configurable cooldown and rate limiting
- Responsive design with mobile menu, touch detection (cursor effects disabled on mobile)
- Reduced motion support via `prefers-reduced-motion`

## User preferences

- Admin password is stored securely; change it from the Security tab.
- Images should use external URLs to save storage space (see `SETUP.md`)
- Social links are editable from admin Settings — leave empty to hide

## Gotchas

- **Always run codegen after editing `openapi.yaml`**: `pnpm --filter @workspace/api-spec run codegen`, then `pnpm run typecheck:libs`
- **DB schema changes need `push`**: `pnpm --filter @workspace/db run push` before the server will recognize new tables
- **If editor types disagree with CLI**: trust `pnpm run typecheck` over the LSP
- **Never run `pnpm dev` at workspace root**: artifacts run via workflows with their own `PORT` and `BASE_PATH`

## Pointers

- See `SETUP.md` for database setup, GitHub push guide, and image hosting recommendations
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
