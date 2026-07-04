export type PrototypeCategory =
  | "animation"
  | "graphics"
  | "ui"
  | "canvas"
  | "navigation";

export type PrototypeKind = "react" | "iframe";

export type PrototypeStatus = "draft" | "stable";

export interface Prototype {
  category: PrototypeCategory;
  categoryDescription?: string;
  description?: string;
  hasControls?: boolean;
  kind: PrototypeKind;
  releasedAt?: string;
  slug: string;
  src?: string;
  status?: PrototypeStatus;
  tags?: string[];
  title: string;
}

export const CATEGORY_LABELS: Record<PrototypeCategory, string> = {
  animation: "Animations",
  graphics: "Graphics",
  ui: "UI",
  canvas: "Canvas",
  navigation: "Navigation",
};

export const PROTOTYPES: Prototype[] = [
  {
    slug: "card-stack",
    title: "Card Stack",
    description:
      "Springy stacked cards that fan out on hover — GSAP stagger and scale.",
    category: "animation",
    categoryDescription:
      "Interactive animated components with stagger, scale, and easing.",
    tags: ["gsap", "hover"],
    kind: "react",
    hasControls: true,
    status: "stable",
    releasedAt: "June 27, 2026",
  },
  {
    slug: "pixel-wave",
    title: "Pixel Wave",
    description: "Canvas pixel grid with GSAP-driven wave displacement.",
    category: "canvas",
    categoryDescription:
      "Canvas and WebGL experiments with live Tweakpane controls.",
    tags: ["canvas", "gsap", "tweakpane"],
    kind: "iframe",
    src: "/prototypes/pixel-wave.html",
    hasControls: false,
    status: "stable",
    releasedAt: "June 27, 2026",
  },
  {
    slug: "wavelength",
    title: "Wavelength",
    description:
      "Overlapping SVG waveforms with a sweeping probe and riding dots — ported from Tint Solutions lab.",
    category: "graphics",
    categoryDescription: "Generative graphics and particle systems.",
    tags: ["svg", "gsap", "waves"],
    kind: "react",
    hasControls: true,
    status: "stable",
    releasedAt: "June 27, 2026",
  },
  {
    slug: "orbit-dots",
    title: "Orbit Dots",
    description: "Orbiting dot field — work in progress.",
    category: "graphics",
    categoryDescription: "Generative graphics and particle systems.",
    tags: ["draft"],
    kind: "react",
    hasControls: true,
    status: "draft",
    releasedAt: "June 27, 2026",
  },
];

export function getRegistryPrototype(slug: string): Prototype | undefined {
  return PROTOTYPES.find((p) => p.slug === slug);
}
