import type { ControlGroup } from "@/lib/control-schema";

export interface OrbitSettings {
  count: number;
  dotColor: string;
  dotSize: number;
  duration: number;
  playing: boolean;
  radius: number;
}

export const DEFAULTS: OrbitSettings = {
  count: 12,
  radius: 80,
  duration: 3,
  playing: true,
  dotColor: "#3B82F6",
  dotSize: 10,
};

export const SCHEMA: ControlGroup<OrbitSettings>[] = [
  {
    title: "Orbit",
    controls: [
      { type: "toggle", key: "playing", label: "Playing" },
      { type: "range", key: "count", label: "Dots", min: 3, max: 24, step: 1 },
      {
        type: "range",
        key: "radius",
        label: "Radius",
        min: 40,
        max: 140,
        step: 1,
      },
      {
        type: "range",
        key: "duration",
        label: "Duration (s)",
        min: 0.5,
        max: 8,
        step: 0.1,
      },
      {
        type: "range",
        key: "dotSize",
        label: "Dot size (px)",
        min: 4,
        max: 24,
        step: 1,
      },
      { type: "color", key: "dotColor", label: "Dot color" },
    ],
  },
];
