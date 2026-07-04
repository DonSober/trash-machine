# Stack Architecture — Prototypes vs App UI

Trash Machine has two layers that share one Next.js app but use different tools
on purpose. Keep the boundary strict: prototypes stay portable and copy-pasteable,
the shell stays maintainable.

| Layer | Scope | Styling | Animation |
| ----- | ----- | ------- | --------- |
| **Visual prototypes** | `prototypes/` | Inline styles | GSAP |
| **Application UI** | Shell, catalog, docs chrome, controls | Tailwind v4 | Motion (`motion/react`) |

---

## 1. Why two stacks?

**Prototypes** are the subject of the page — card stacks, SVG waves, orbiting
dots. They need precise, imperative animation (timelines, stagger, per-frame SVG
attribute updates) and must render correctly when copied into another project
with no build-time styling dependency. They use **GSAP** for motion and plain
**inline styles** (`CSSProperties`) for layout.

**App UI** is the chrome around those experiments — the shell, command palette,
catalog, control dock, docs layout. It uses **Tailwind** utility classes and
**Motion** for transitions.

---

## 2. Directory map

```
prototypes/{slug}/
  visual.tsx          ← GSAP + inline styles (required for react kind)
  controls.ts         ← control schema + defaults (optional)
  docs.ts             ← prose for the detail page (optional)
prototypes/registry.ts ← slug, title, category, kind, status, tags
prototypes/loaders.ts  ← lazy import map (react kind only)

components/
  shell/              ← app shell, command menu, overlay nav drawer
  catalog/            ← component catalog (hero, cards, filters)
  detail/             ← detail page: docs, viewport frame, control dock
  layout/             ← docs pane, page header, playground layout
  controls/           ← control panel that drives prototype settings
  motion/             ← Motion-based components (e.g. tab dock, command palette)
  unlumen-ui/         ← components added from the @unlumen-ui registry
  ui/button/          ← custom button (CSS in app/button.css)
```

App-UI styling is Tailwind utility classes inline in JSX. The one scoped
stylesheet is `components/layout/docs-pane.css` for the Paper-matched docs pane;
global tokens/colors live in `app/app.css`, `app/dd-colors.css`, and
`app/button.css`.

---

## 3. Prototype layer (`prototypes/`)

- Every React prototype default-exports a `visual.tsx` client component.
- Layout is **inline styles** — declare static style objects as module-level
  `CSSProperties` consts and spread per-instance values (color, size) inline.
- **GSAP** drives all motion inside the preview stage. Use `@gsap/react`
  (`useGSAP`) with `scope`, `dependencies`, and `revertOnUpdate`.
- Register the hook once per file: `gsap.registerPlugin(useGSAP)`.
- For values that must apply on the first paint (e.g. a centering offset), use
  `gsap.set(...)` so they don't depend on the animation frame loop.
- For frequently-updated SVG attributes, prefer `gsap.quickSetter(el, "attr")`
  over per-frame `setAttribute`.
- Respect reduced motion with `gsap.matchMedia("(prefers-reduced-motion: …)")`,
  which reverts automatically. Do not use Motion here.

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type CSSProperties, useRef } from "react";
import { usePrototypeSettings } from "@/lib/prototype-settings-context";
import type { MySettings } from "./controls";

gsap.registerPlugin(useGSAP);

const stageStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

export default function MyPrototypeVisual() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const { settings } = usePrototypeSettings<MySettings>();

  useGSAP(
    () => {
      /* prototype-only tweens, scoped to scopeRef */
    },
    { scope: scopeRef, dependencies: [settings], revertOnUpdate: true }
  );

  return <div ref={scopeRef} style={stageStyle}>{/* animated subject */}</div>;
}
```

Iframe/canvas experiments (`kind: "iframe"`) live in `public/prototypes/{slug}.html`
and may use vanilla GSAP; they still render inside the app's viewport frame.

---

## 4. App UI layer (`components/shell`, `catalog`, `detail`, `controls`, `layout`)

- Style with **Tailwind** utility classes (semantic tokens like `bg-background`,
  `text-muted-foreground`; the root layout sets `class="dark"`).
- Use **Motion** (`motion/react`) for UI transitions: the overlay nav drawer,
  command palette, list staggers, layout animations.
- Pull reusable interactive components from the configured shadcn registries
  (`@beui`, `@unlumen-ui`) via `npx shadcn@latest add @unlumen-ui/<name>`.
- Do **not** import GSAP in shell/catalog/detail/controls/layout components.

```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";

export function Drawer({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          animate={{ x: 0 }}
          className="fixed inset-y-0 left-0 z-50 bg-background"
          exit={{ x: "-100%" }}
          initial={{ x: "-100%" }}
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* nav links */}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
```

---

## 5. Animation responsibilities

| Concern | Tool | Where |
| ------- | ---- | ----- |
| Card fan-out, wave sweep, orbit paths | GSAP | `prototypes/*/visual.tsx` |
| Scroll-linked / scrubbed effects | GSAP ScrollTrigger | Prototypes only |
| Overlay nav drawer enter/exit | Motion | `components/unlumen-ui/sidebar-002.tsx` |
| Command menu | cmdk + Motion | `components/shell/command-menu.tsx` |
| Button press / loading spinner | CSS | `components/ui/button` + `app/button.css` |

**Rule of thumb:** if the animation is the *subject* of the page, use GSAP. If
it supports *navigation or chrome*, use Motion.

---

## 6. Prototype settings & controls

Prototype state is typed and persisted in `lib/use-persisted-settings.ts`,
exposed through `lib/prototype-settings-context.tsx`:

- `PrototypeSettingsProvider<T>` wraps the detail page.
- `usePrototypeSettings<T>()` reads `{ settings }` inside a `visual.tsx`.
- `useRegisterPrototypeAction(handler)` lets a prototype respond to control-dock
  actions (e.g. "replay").

A prototype's `controls.ts` exports `DEFAULTS` and a `SCHEMA` of control groups
(`toggle`, `range`, `color`, `ease`, `action`). The control dock in
`components/detail/control-dock.tsx` renders that schema; prototypes only read
the resulting settings.

---

## 7. Viewport boundary

`components/detail/viewport-frame.tsx` is the isolation boundary:

- **Outside** the dynamic import: app UI (Tailwind frame, loading state, control
  dock, canvas toolbar).
- **Inside** the lazily-loaded `visual.tsx`: GSAP + inline styles only.

React prototypes are loaded with `next/dynamic({ ssr: false })`, memoized at
module scope per slug (see `viewport-frame.tsx`). Never pass Motion or app-UI
wrappers into a prototype visual; prototypes receive only their own settings via
hooks.

---

## 8. Anti-patterns

| Don't | Do instead |
| ----- | ---------- |
| GSAP in shell / drawer / dialog | Motion |
| Motion or Tailwind classes inside `visual.tsx` | Plain elements + inline styles + GSAP |
| Framer Motion / `framer-motion` package | `motion/react` (app UI) or GSAP (prototypes) |
| A build-step styling library (e.g. StyleX) in prototypes | Inline `CSSProperties` so prototypes render standalone |
| `dynamic()` called inside a render body | Memoize the dynamic component at module scope |
| Per-frame `setAttribute` in a GSAP `onUpdate` | `gsap.quickSetter(el, "attr")` |
| One global animation library for everything | Pick per layer (see the table in §1) |

---

## 9. Related docs

- [README](../README.md) — run instructions and prototype registration
- [registries](./beui.md) — shadcn registries configured for adding components
