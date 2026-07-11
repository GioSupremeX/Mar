# Setup Guide

## What you need to run this

- **Node.js 24** (already installed on Replit)
- **pnpm** (already installed)
- **PostgreSQL database** (free tier works fine — we only store text/settings, no image blobs)

## 1. Database

The app uses **PostgreSQL** via Drizzle ORM. On Replit, the `DATABASE_URL` env var is already set.

To connect to your own free PostgreSQL (e.g., Neon, Supabase, Railway):
1. Copy your connection string (starts with `postgresql://` or `postgres://`)
2. In Replit: Secrets → `DATABASE_URL` → paste it
3. Push the schema:
   ```bash
   pnpm --filter @workspace/db run push
   ```

The database is tiny — it stores:
- Text settings (artist name, bio, toggles, social URLs)
- Guestbook messages (name + message)
- Artwork metadata (title, category, **external image URL** — not the image itself)

No images are stored in the database. Images are either:
- External URLs (imgur, cloudinary, etc.) — recommended for free DBs
- Or Replit Object Storage (for files you upload via the admin panel)

## 2. Image strategy (saves database space)

**Recommended:** Host images externally and paste the URL in the admin dashboard.

Free image hosting options:
- **Imgur** — upload anonymously, copy direct link
- **Cloudinary** — generous free tier, great for artists
- **GitHub** — commit images to a repo, use raw URLs
- **Catbox.moe / Postimg.cc** — simple anonymous upload

Avoid uploading large files via the admin uploader if your Object Storage or Replit storage is limited.

## 3. GitHub

To push this project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Or use Replit's Git panel (left sidebar → Git) to connect and push.

**What to put in `.gitignore`** (already done):
- `node_modules/`
- `.env` files
- `*.log`
- `.replit-artifact/`
- `dist/`, `build/`

**Never commit:**
- `DATABASE_URL` with real credentials
- `SESSION_SECRET`
- Any uploaded user images in the repo (use external hosting instead)

## 4. Admin password

The default admin password is: **`8e333625d268`**

Log in at `/admin` and change it immediately in **Security → Change Password**.
The new hash is stored in the database (`site_settings` table) and survives restarts.

## 5. Common commands

| Command | What it does |
|---------|-------------|
| `pnpm run typecheck` | Check TypeScript across all packages |
| `pnpm run build` | Build everything for production |
| `pnpm --filter @workspace/db run push` | Push DB schema changes |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API types from OpenAPI spec |
| `pnpm --filter @workspace/api-server run dev` | Start the API server |
| `pnpm --filter @workspace/portfolio run dev` | Start the portfolio frontend |

## 6. Project structure

```
artifacts/
  api-server/      → Express backend (auth, settings, guestbook, artworks)
  portfolio/       → Vite + React frontend (public site + admin dashboard)
lib/
  db/              → Drizzle ORM schema + migrations
  api-spec/        → OpenAPI spec + Orval codegen config
  api-client-react/ → Auto-generated React Query hooks
  api-zod/         → Auto-generated Zod schemas
```

## 7. If something breaks

- **Type errors after changing the API**: Run `pnpm --filter @workspace/api-spec run codegen`, then `pnpm run typecheck:libs`
- **"relation does not exist"**: Run `pnpm --filter @workspace/db run push`
- **Admin password forgotten**: Check the database (`site_settings` table, `adminPasswordHash` key) or reset by pushing a new hash via the DB directly.
