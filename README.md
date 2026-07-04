# Trash Machine

Interactive React prototype library. Each prototype is a self-contained GSAP
visual; the surrounding app UI (shell, catalog, docs, controls) is built with
Tailwind and Motion.

## Stack

- Next.js 16 (App Router), compiled with SWC
- **Visual prototypes** — GSAP + `@gsap/react`, styled with inline styles
- **Application UI** — Tailwind v4 + Motion (`motion/react`); shadcn-style
  components from the `@beui` / `@unlumen-ui` registries
- cmdk command palette
- Biome + Ultracite for lint/format

See [`docs/stack-architecture.md`](docs/stack-architecture.md) for the layer
boundaries between prototypes and app UI.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/components](http://localhost:3000/components).

## Production

```bash
npm run build
npm start
```

Set `HIDE_DRAFTS=true` in production to exclude prototypes with `status: "draft"` from the sidebar, catalog, and static routes.

## Adding a prototype

1. Create `prototypes/{slug}/visual.tsx` (+ optional `controls.ts`, `docs.ts`)
2. Register in `prototypes/registry.ts`
3. Add lazy loader in `prototypes/loaders.ts` (React kind only)
4. Add docs entry in `lib/get-prototype-docs.ts`

For iframe/HTML experiments, add `public/prototypes/{slug}.html` and set
`kind: "iframe"` in the registry (see `pixel-wave` for an example).

See [`docs/stack-architecture.md`](docs/stack-architecture.md) for the prototype
vs app UI split.
