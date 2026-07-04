# AGENTS.md

## Cursor Cloud specific instructions

**Project:** Trash Machine — a single-package Next.js 16 (App Router, Turbopack) interactive React prototype library. No backend, database, Docker, or external services; there is only one runnable service (the Next.js app). No secrets or `.env` are required (`HIDE_DRAFTS=true` is an optional production-only flag).

Standard commands live in `package.json` scripts and `README.md`; use those as the source of truth. Package manager is **npm** (`package-lock.json`).

Non-obvious notes:
- The dev server (`npm run dev`) serves on `http://localhost:3000`, but the app's real entry page is `http://localhost:3000/components` (`/` is a separate landing route). Open `/components` to see the prototype catalog.
- Lint is Biome (`npm run lint` = `biome check .`), not ESLint, despite `eslint`/`eslint-config-next` being present in devDependencies.
- Tests are Vitest + jsdom (`npm test`) and run standalone — no dev server needed.
- `lefthook` is a devDependency but no `lefthook.yml` exists and no git hooks are installed, so nothing runs automatically on commit.
