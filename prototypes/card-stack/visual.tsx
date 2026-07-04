"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type CSSProperties, useRef, useState } from "react";
import {
  usePrototypeSettings,
  useRegisterPrototypeAction,
} from "@/lib/prototype-settings-context";
import type { CardStackSettings } from "./controls";

gsap.registerPlugin(useGSAP);

const stageStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const cardBaseStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 160,
  height: 220,
  borderRadius: 12,
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-start",
  padding: 12,
  border: "1px solid rgba(255,255,255,0.12)",
};

export default function CardStackVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = usePrototypeSettings<CardStackSettings>();
  const [hovered, setHovered] = useState(false);

  useRegisterPrototypeAction((action) => {
    if (action === "replay") {
      // Drop to the resting state, then re-enter on the next frame so the
      // spread/scale tween plays again from the start.
      setHovered(false);
      requestAnimationFrame(() => setHovered(true));
    }
  });

  useGSAP(
    () => {
      // revertOnUpdate reverts and kills existing tweens on every re-sync, so
      // no manual killTweensOf is needed here.
      const cards = gsap.utils.toArray<HTMLElement>(".tm-card");
      if (cards.length === 0) {
        return;
      }

      // Each card is absolutely pinned to the stage center (top/left 50%).
      // Set the -50% centering offset immediately so cards are centered on the
      // first paint, then animate x/y/rotate relative to that point.
      gsap.set(cards, { xPercent: -50, yPercent: -50 });

      const center = (i: number) => i - (settings.cardCount - 1) / 2;
      const active = hovered && settings.playing;
      const spread = active ? settings.spread : 0;
      const scale = active ? settings.scale : 1;

      gsap.to(cards, {
        x: (i) => center(i) * spread,
        y: (i) => -i * 6,
        scale,
        rotate: (i) => center(i) * (active ? 4 : 0),
        duration: settings.duration,
        ease: settings.ease,
        stagger: settings.stagger,
      });
    },
    {
      scope: containerRef,
      dependencies: [settings, hovered],
      revertOnUpdate: true,
    }
  );

  const cards = Array.from({ length: settings.cardCount }, (_, i) => i);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover-only visual demo stage, no semantic interaction
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: hover-only visual demo stage, no semantic interaction
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={containerRef}
      style={stageStyle}
    >
      {cards.map((i) => (
        <div
          className="tm-card"
          key={i}
          style={{
            ...cardBaseStyle,
            backgroundColor: settings.cardColor,
            zIndex: i,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(0,0,0,0.35)",
            }}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
