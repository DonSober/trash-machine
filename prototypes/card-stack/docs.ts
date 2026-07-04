export const usageCode = `import CardStackVisual from "@/prototypes/card-stack/visual";

<CardStackVisual />`;

export const apiRows: {
  name: string;
  type: string;
  default: string;
  description: string;
}[] = [
  {
    name: "duration",
    type: "number",
    default: "0.55",
    description: "Tween duration in seconds.",
  },
  {
    name: "ease",
    type: "string",
    default: "back.out(1.4)",
    description: "GSAP ease string.",
  },
  {
    name: "stagger",
    type: "number",
    default: "0.06",
    description: "Stagger between cards.",
  },
  {
    name: "spread",
    type: "number",
    default: "28",
    description: "Horizontal fan spread in pixels.",
  },
  {
    name: "scale",
    type: "number",
    default: "1.04",
    description: "Scale on hover.",
  },
  {
    name: "cardCount",
    type: "number",
    default: "5",
    description: "Number of stacked cards.",
  },
  {
    name: "cardColor",
    type: "string",
    default: "#E5E5E5",
    description: "Card fill color.",
  },
];

export const notes = [
  "Uses useGSAP with revertOnUpdate so control changes re-run the tween cleanly.",
  "Hover the stack to fan cards; move away to collapse.",
  "Replay action re-triggers the entrance stagger from the control panel.",
];

export const fileTree = [
  "prototypes/card-stack/visual.tsx",
  "prototypes/card-stack/controls.ts",
  "prototypes/card-stack/docs.ts",
];
