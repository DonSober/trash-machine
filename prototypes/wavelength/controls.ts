import type { ControlGroup } from "@/lib/control-schema";

export const DASH_STYLES = [
  "solid",
  "dotted",
  "dashed",
  "dash-dot",
  "long",
] as const;

export type DashStyle = (typeof DASH_STYLES)[number];

export const DASH_TO_ARRAY: Record<DashStyle, string> = {
  solid: "",
  dotted: "2 6",
  dashed: "7 7",
  "dash-dot": "12 5 3 5",
  long: "16 10",
};

export const EASING_OPTIONS = [
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "circInOut",
] as const;

export type EasingOption = (typeof EASING_OPTIONS)[number];

export const MODE_OPTIONS = ["loop", "reverse", "mirror"] as const;

export type LoopMode = (typeof MODE_OPTIONS)[number];

export interface WavelengthSettings {
  axisOpacity: number;
  axisY: number;
  baselineColor: string;
  baselineDash: DashStyle;
  baselineWidth: number;
  bg: string;
  contentScale: number;
  dotColor: string;
  dotRadius: number;
  easing: EasingOption;
  gridCount: number;
  gridOpacity: number;
  mode: LoopMode;
  playing: boolean;
  probeColor: string;
  probeFade: boolean;
  probeHeight: number;
  probeOpacity: number;
  probeWidth: number;
  samples: number;
  showBaseline: boolean;
  showDots: boolean;
  showGrid: boolean;
  showProbe: boolean;
  speed: number;
  sweepInset: number;
  w1Amp: number;
  w1AmpEnd: number;
  w1Color: string;
  w1Dash: DashStyle;
  w1Freq: number;
  w1On: boolean;
  w1Width: number;
  w2Amp: number;
  w2AmpEnd: number;
  w2Color: string;
  w2Dash: DashStyle;
  w2Freq: number;
  w2On: boolean;
  w2Width: number;
  w3Amp: number;
  w3Color: string;
  w3Dash: DashStyle;
  w3Decay: number;
  w3On: boolean;
  w3Width: number;
}

const INK = "#1c1a17";

export const DEFAULTS: WavelengthSettings = {
  bg: "#f4d44e",
  axisY: 0.46,
  contentScale: 0.4,
  samples: 700,
  w1On: true,
  w1Amp: 150,
  w1AmpEnd: 150,
  w1Freq: 9,
  w1Width: 1.6,
  w1Dash: "dashed",
  w1Color: INK,
  w2On: true,
  w2Amp: 130,
  w2AmpEnd: 70,
  w2Freq: 5,
  w2Width: 2.6,
  w2Dash: "solid",
  w2Color: INK,
  w3On: true,
  w3Amp: 150,
  w3Decay: 0.14,
  w3Width: 1.8,
  w3Dash: "dash-dot",
  w3Color: INK,
  showGrid: true,
  gridCount: 5,
  gridOpacity: 0.13,
  axisOpacity: 0.25,
  showBaseline: true,
  baselineWidth: 1.4,
  baselineDash: "long",
  baselineColor: INK,
  showProbe: true,
  probeColor: "#000000",
  probeWidth: 1,
  probeOpacity: 0.45,
  probeHeight: 0.9,
  probeFade: false,
  showDots: true,
  dotRadius: 8,
  dotColor: INK,
  playing: true,
  speed: 7,
  easing: "easeInOut",
  mode: "mirror",
  sweepInset: 0,
};

const dash = (key: keyof WavelengthSettings, label: string) => ({
  type: "select" as const,
  key,
  label,
  options: DASH_STYLES,
});

export const SCHEMA: ControlGroup<WavelengthSettings>[] = [
  {
    title: "Canvas",
    controls: [
      { type: "color", key: "bg", label: "Background" },
      {
        type: "range",
        key: "axisY",
        label: "Axis position",
        min: 0.2,
        max: 0.8,
        step: 0.01,
      },
      {
        type: "range",
        key: "contentScale",
        label: "Graphic scale",
        min: 0.1,
        max: 0.7,
        step: 0.01,
      },
      {
        type: "range",
        key: "samples",
        label: "Resolution",
        min: 80,
        max: 1200,
        step: 10,
      },
    ],
  },
  {
    title: "Wave 1 — Sine",
    controls: [
      { type: "toggle", key: "w1On", label: "Visible" },
      {
        type: "range",
        key: "w1Amp",
        label: "Amplitude start",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        type: "range",
        key: "w1AmpEnd",
        label: "Amplitude end",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        type: "range",
        key: "w1Freq",
        label: "Frequency",
        min: 1,
        max: 20,
        step: 1,
      },
      {
        type: "range",
        key: "w1Width",
        label: "Stroke width",
        min: 0.5,
        max: 6,
        step: 0.1,
      },
      dash("w1Dash", "Dash style"),
      { type: "color", key: "w1Color", label: "Colour" },
    ],
  },
  {
    title: "Wave 2 — Modulated",
    controls: [
      { type: "toggle", key: "w2On", label: "Visible" },
      {
        type: "range",
        key: "w2Amp",
        label: "Amplitude start",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        type: "range",
        key: "w2AmpEnd",
        label: "Amplitude end",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        type: "range",
        key: "w2Freq",
        label: "Frequency",
        min: 1,
        max: 20,
        step: 1,
      },
      {
        type: "range",
        key: "w2Width",
        label: "Stroke width",
        min: 0.5,
        max: 6,
        step: 0.1,
      },
      dash("w2Dash", "Dash style"),
      { type: "color", key: "w2Color", label: "Colour" },
    ],
  },
  {
    title: "Wave 3 — Decay",
    controls: [
      { type: "toggle", key: "w3On", label: "Visible" },
      {
        type: "range",
        key: "w3Amp",
        label: "Amplitude",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        type: "range",
        key: "w3Decay",
        label: "Decay length",
        min: 0.03,
        max: 0.6,
        step: 0.01,
      },
      {
        type: "range",
        key: "w3Width",
        label: "Stroke width",
        min: 0.5,
        max: 6,
        step: 0.1,
      },
      dash("w3Dash", "Dash style"),
      { type: "color", key: "w3Color", label: "Colour" },
    ],
  },
  {
    title: "Grid & axis",
    controls: [
      { type: "toggle", key: "showGrid", label: "Show grid" },
      {
        type: "range",
        key: "gridCount",
        label: "Grid lines",
        min: 0,
        max: 12,
        step: 1,
      },
      {
        type: "range",
        key: "gridOpacity",
        label: "Grid opacity",
        min: 0,
        max: 0.5,
        step: 0.01,
      },
      {
        type: "range",
        key: "axisOpacity",
        label: "Axis opacity",
        min: 0,
        max: 1,
        step: 0.01,
      },
      { type: "toggle", key: "showBaseline", label: "Show baseline" },
      {
        type: "range",
        key: "baselineWidth",
        label: "Baseline width",
        min: 0.5,
        max: 4,
        step: 0.1,
      },
      dash("baselineDash", "Baseline dash"),
      { type: "color", key: "baselineColor", label: "Baseline colour" },
    ],
  },
  {
    title: "Probe",
    controls: [
      { type: "toggle", key: "showProbe", label: "Show probe" },
      { type: "color", key: "probeColor", label: "Probe colour" },
      {
        type: "range",
        key: "probeWidth",
        label: "Probe width",
        min: 0.5,
        max: 4,
        step: 0.1,
      },
      {
        type: "range",
        key: "probeOpacity",
        label: "Probe opacity",
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        type: "range",
        key: "probeHeight",
        label: "Probe height",
        min: 0.1,
        max: 1.2,
        step: 0.01,
      },
      { type: "toggle", key: "probeFade", label: "Fade ends" },
    ],
  },
  {
    title: "Dots",
    controls: [
      { type: "toggle", key: "showDots", label: "Show dots" },
      {
        type: "range",
        key: "dotRadius",
        label: "Dot radius",
        min: 2,
        max: 20,
        step: 0.5,
      },
      { type: "color", key: "dotColor", label: "Dot colour" },
    ],
  },
  {
    title: "Animation",
    controls: [
      { type: "toggle", key: "playing", label: "Playing" },
      {
        type: "range",
        key: "speed",
        label: "Duration (s)",
        min: 1,
        max: 20,
        step: 0.5,
      },
      {
        type: "select",
        key: "easing",
        label: "Easing",
        options: EASING_OPTIONS,
      },
      {
        type: "select",
        key: "mode",
        label: "Loop mode",
        options: MODE_OPTIONS,
      },
      {
        type: "range",
        key: "sweepInset",
        label: "Sweep inset",
        min: 0,
        max: 200,
        step: 5,
      },
    ],
  },
];
