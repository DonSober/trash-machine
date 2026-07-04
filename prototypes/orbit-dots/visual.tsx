"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type CSSProperties, useMemo, useRef } from "react";
import { usePrototypeSettings } from "@/lib/prototype-settings-context";
import type { OrbitSettings } from "./controls";

gsap.registerPlugin(useGSAP);

const stageStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

export default function OrbitDotsVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const { settings } = usePrototypeSettings<OrbitSettings>();

  useGSAP(
    () => {
      if (!settings.playing) {
        return;
      }
      // One tween rotating the whole ring is far cheaper than one tween per
      // dot, and keeps each dot's static translate intact. Linear ease keeps a
      // constant spin with no hitch at each loop boundary.
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: settings.duration,
        ease: "none",
        repeat: -1,
      });
    },
    {
      scope: containerRef,
      dependencies: [settings.playing, settings.duration],
      revertOnUpdate: true,
    }
  );

  const dots = useMemo(
    () =>
      Array.from({ length: settings.count }, (_, i) => {
        const angle = (i / settings.count) * Math.PI * 2;
        return {
          x: Math.cos(angle) * settings.radius,
          y: Math.sin(angle) * settings.radius,
        };
      }),
    [settings.count, settings.radius]
  );

  return (
    <div ref={containerRef} style={stageStyle}>
      {/* Zero-size pivot at the canvas center; the ring rotates around it. */}
      <div ref={orbitRef} style={{ position: "relative", width: 0, height: 0 }}>
        {dots.map((d) => (
          <div
            className="tm-dot"
            key={`${d.x}-${d.y}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: settings.dotSize,
              height: settings.dotSize,
              borderRadius: "50%",
              backgroundColor: settings.dotColor,
              // Move to the ring point, then pull back by half the dot so it
              // sits centered on that point.
              transform: `translate(${d.x}px, ${d.y}px) translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
