export const usageCode = `import Wavelength from "@/prototypes/wavelength/visual";

<Wavelength />`;

export const apiRows: {
  name: string;
  type: string;
  default: string;
  description: string;
}[] = [
  {
    name: "speed",
    type: "number",
    default: "7",
    description: "Sweep duration in seconds.",
  },
  {
    name: "mode",
    type: "loop | reverse | mirror",
    default: "mirror",
    description: "Loop behaviour for the horizontal probe.",
  },
  {
    name: "w1Freq",
    type: "number",
    default: "9",
    description: "Frequency of the primary cosine wave.",
  },
  {
    name: "w2AmpEnd",
    type: "number",
    default: "70",
    description: "End amplitude for the modulated wave.",
  },
  {
    name: "w3Decay",
    type: "number",
    default: "0.14",
    description: "Exponential decay factor for wave 3.",
  },
  {
    name: "contentScale",
    type: "number",
    default: "0.4",
    description: "Scale of the waveform group inside the SVG viewBox.",
  },
];

export const notes = [
  "SVG paths are generated from pure math — no D3 dependency.",
  "GSAP drives a single progress value; probe position and dot cy values update via refs on each tick.",
  "Three wave types: cosine (dashed), amplitude-modulated cosine (solid), exponential decay (dash-dot).",
  "Ported from Tint Solutions /lab/wavelength; controls persist via the Trash Machine control panel.",
];

export const fileTree = [
  "prototypes/wavelength/visual.tsx",
  "prototypes/wavelength/controls.ts",
  "prototypes/wavelength/docs.ts",
];
