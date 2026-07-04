import type { ControlGroup } from "@/lib/control-schema";

export interface CardStackSettings {
  cardColor: string;
  cardCount: number;
  duration: number;
  ease: string;
  playing: boolean;
  scale: number;
  spread: number;
  stagger: number;
}

export const DEFAULTS: CardStackSettings = {
  duration: 0.55,
  ease: "back.out(1.4)",
  stagger: 0.06,
  spread: 28,
  scale: 1.04,
  cardCount: 5,
  playing: true,
  cardColor: "#E5E5E5",
};

export const SCHEMA: ControlGroup<CardStackSettings>[] = [
  {
    title: "Tween",
    controls: [
      { type: "toggle", key: "playing", label: "Playing" },
      {
        type: "range",
        key: "duration",
        label: "Duration (s)",
        min: 0.1,
        max: 2,
        step: 0.05,
      },
      { type: "ease", key: "ease", label: "Ease" },
      {
        type: "range",
        key: "stagger",
        label: "Stagger (s)",
        min: 0,
        max: 0.3,
        step: 0.01,
      },
    ],
  },
  {
    title: "Layout",
    controls: [
      {
        type: "range",
        key: "spread",
        label: "Spread (px)",
        min: 0,
        max: 80,
        step: 1,
      },
      {
        type: "range",
        key: "scale",
        label: "Hover scale",
        min: 1,
        max: 1.2,
        step: 0.01,
      },
      {
        type: "range",
        key: "cardCount",
        label: "Cards",
        min: 2,
        max: 8,
        step: 1,
      },
      { type: "color", key: "cardColor", label: "Card color" },
    ],
  },
  {
    title: "Actions",
    controls: [{ type: "action", key: "replay", label: "Replay" }],
  },
];
