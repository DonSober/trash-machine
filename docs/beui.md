# Component registries

App-UI components can be pulled in with the shadcn CLI from the registries
configured in `components.json`:

| Namespace | URL |
| --------- | --- |
| `@beui` | `https://beui.dev/r/{name}.json` |
| `@unlumen-ui` | `https://ui.unlumen.com/r/{name}.json` |

```bash
npx shadcn@latest add @unlumen-ui/sidebar-002
npx shadcn@latest add @beui/tabs
```

Added components land under `components/` (e.g. `components/unlumen-ui/`,
`components/motion/`) and use Tailwind + Motion, matching the dark shell. The
`cn()` helper lives in `lib/utils.ts`.

## Notes

- These registries are for **app UI** only. Do not import shadcn/registry
  components inside `prototypes/*/visual.tsx` — see
  [`stack-architecture.md`](./stack-architecture.md) for the layer boundary.
- The custom button at `components/ui/button/` (styled via `app/button.css`) is
  separate from registry components.
