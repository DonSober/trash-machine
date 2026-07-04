"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type CSSProperties, useId, useMemo, useRef } from "react";
import { usePrototypeSettings } from "@/lib/prototype-settings-context";
import {
  DASH_TO_ARRAY,
  type EasingOption,
  type LoopMode,
  type WavelengthSettings,
} from "./controls";

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

const svgStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block",
};

gsap.registerPlugin(useGSAP);

const W = 1160;
const H = 400;
const TAU = Math.PI * 2;

function buildPath(
  fn: (x: number) => number,
  samples: number,
  width: number
): string {
  const n = Math.max(2, Math.round(samples));
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * width;
    const y = fn(x);
    parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return parts.join(" ");
}

function mapEase(easing: EasingOption): string {
  switch (easing) {
    case "linear":
      return "none";
    case "easeIn":
      return "power2.in";
    case "easeOut":
      return "power2.out";
    case "easeInOut":
      return "power2.inOut";
    case "circInOut":
      return "circ.inOut";
    default: {
      const _exhaustive: never = easing;
      return _exhaustive;
    }
  }
}

function mapLoopMode(mode: LoopMode): { yoyo: boolean } {
  switch (mode) {
    case "loop":
      return { yoyo: false };
    case "reverse":
    case "mirror":
      return { yoyo: true };
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export default function WavelengthVisual() {
  const { settings } = usePrototypeSettings<WavelengthSettings>();
  const scopeRef = useRef<HTMLDivElement>(null);
  const probeLineRef = useRef<SVGLineElement>(null);
  const dot1Ref = useRef<SVGCircleElement>(null);
  const dot2Ref = useRef<SVGCircleElement>(null);
  const dot3Ref = useRef<SVGCircleElement>(null);

  const axisYpx = H * settings.axisY;
  const inset = settings.sweepInset;

  const waveFns = useMemo(() => {
    const ampAt = (start: number, end: number, x: number) =>
      start + (end - start) * (x / W);
    return {
      yW1: (x: number) =>
        axisYpx -
        ampAt(settings.w1Amp, settings.w1AmpEnd, x) *
          Math.cos((x / W) * settings.w1Freq * TAU),
      yW2: (x: number) =>
        axisYpx -
        ampAt(settings.w2Amp, settings.w2AmpEnd, x) *
          Math.cos((x / W) * settings.w2Freq * TAU),
      yW3: (x: number) =>
        axisYpx - settings.w3Amp * Math.exp(-x / (W * settings.w3Decay)),
    };
  }, [
    axisYpx,
    settings.w1Amp,
    settings.w1AmpEnd,
    settings.w1Freq,
    settings.w2Amp,
    settings.w2AmpEnd,
    settings.w2Freq,
    settings.w3Amp,
    settings.w3Decay,
  ]);

  const paths = useMemo(
    () => ({
      w1: buildPath(waveFns.yW1, settings.samples, W),
      w2: buildPath(waveFns.yW2, settings.samples, W),
      w3: buildPath(waveFns.yW3, settings.samples, W),
    }),
    [waveFns, settings.samples]
  );

  const probeX = (v: number) => inset + v * (W - 2 * inset);

  useGSAP(
    () => {
      if (!settings.playing) {
        return;
      }

      // "attr" quickSetters reuse one AttrPlugin setter per element (setting
      // real SVG attributes, cross-browser) instead of allocating a fresh
      // setAttribute path every frame in the hot onUpdate loop.
      const setLine = gsap.quickSetter(probeLineRef.current, "attr");
      const setDot1 = gsap.quickSetter(dot1Ref.current, "attr");
      const setDot2 = gsap.quickSetter(dot2Ref.current, "attr");
      const setDot3 = gsap.quickSetter(dot3Ref.current, "attr");

      const applyProbe = (v: number) => {
        const x = probeX(v);
        setLine({ x1: x, x2: x });
        setDot1({ cx: x, cy: waveFns.yW1(x) });
        setDot2({ cx: x, cy: waveFns.yW2(x) });
        setDot3({ cx: x, cy: waveFns.yW3(x) });
      };

      // matchMedia auto-reverts when reduced-motion toggles; reduced-motion
      // users see the static probe at the start position, no animation.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => applyProbe(0));
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { value: 0 };
        applyProbe(0);
        const { yoyo } = mapLoopMode(settings.mode);
        gsap.to(proxy, {
          value: 1,
          duration: settings.speed,
          ease: mapEase(settings.easing),
          repeat: -1,
          yoyo,
          onUpdate: () => applyProbe(proxy.value),
        });
      });
    },
    {
      scope: scopeRef,
      dependencies: [
        settings.playing,
        settings.speed,
        settings.easing,
        settings.mode,
        settings.sweepInset,
        waveFns,
      ],
      revertOnUpdate: true,
    }
  );

  const gridXs = Array.from(
    { length: settings.gridCount },
    (_, i) => ((i + 1) / (settings.gridCount + 1)) * W
  );
  const cs = settings.contentScale;
  const groupTransform = `translate(${W / 2} ${H / 2}) scale(${cs}) translate(${-W / 2} ${-H / 2})`;

  const probeHalf = (settings.probeHeight * H) / 2;
  const probeTop = axisYpx - probeHalf;
  const probeBottom = axisYpx + probeHalf;
  const probeGradId = useId().replace(/:/g, "");
  const probeStroke = settings.probeFade
    ? `url(#${probeGradId})`
    : settings.probeColor;

  const waveDefs = [
    {
      id: "w1",
      on: settings.w1On,
      d: paths.w1,
      dash: DASH_TO_ARRAY[settings.w1Dash],
      width: settings.w1Width,
      color: settings.w1Color,
    },
    {
      id: "w2",
      on: settings.w2On,
      d: paths.w2,
      dash: DASH_TO_ARRAY[settings.w2Dash],
      width: settings.w2Width,
      color: settings.w2Color,
    },
    {
      id: "w3",
      on: settings.w3On,
      d: paths.w3,
      dash: DASH_TO_ARRAY[settings.w3Dash],
      width: settings.w3Width,
      color: settings.w3Color,
    },
  ];

  return (
    <div ref={scopeRef} style={{ ...stageStyle, backgroundColor: settings.bg }}>
      <svg
        aria-label="Animated overlapping waveforms with tracking dots"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={svgStyle}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={groupTransform}>
          {settings.showGrid &&
            gridXs.map((gx) => (
              <line
                key={gx}
                stroke={`rgba(0,0,0,${settings.gridOpacity})`}
                strokeWidth={1}
                x1={gx}
                x2={gx}
                y1={H * 0.08}
                y2={H * 0.92}
              />
            ))}

          <line
            stroke={`rgba(0,0,0,${settings.axisOpacity})`}
            strokeWidth={1}
            x1={0}
            x2={W}
            y1={axisYpx}
            y2={axisYpx}
          />

          {settings.showBaseline && (
            <line
              stroke={settings.baselineColor}
              strokeDasharray={
                DASH_TO_ARRAY[settings.baselineDash] || undefined
              }
              strokeWidth={settings.baselineWidth}
              x1={0}
              x2={W}
              y1={axisYpx}
              y2={axisYpx}
            />
          )}

          {waveDefs.map((wave) =>
            wave.on ? (
              <path
                d={wave.d}
                fill="none"
                key={wave.id}
                stroke={wave.color}
                strokeDasharray={wave.dash || undefined}
                strokeLinecap="round"
                strokeWidth={wave.width}
              />
            ) : null
          )}

          {settings.showProbe && (
            <>
              {settings.probeFade && (
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id={probeGradId}
                    x1="0"
                    x2="0"
                    y1={probeTop}
                    y2={probeBottom}
                  >
                    <stop
                      offset="0"
                      stopColor={settings.probeColor}
                      stopOpacity={0}
                    />
                    <stop
                      offset="0.18"
                      stopColor={settings.probeColor}
                      stopOpacity={settings.probeOpacity}
                    />
                    <stop
                      offset="0.82"
                      stopColor={settings.probeColor}
                      stopOpacity={settings.probeOpacity}
                    />
                    <stop
                      offset="1"
                      stopColor={settings.probeColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
              )}
              <line
                ref={probeLineRef}
                stroke={probeStroke}
                strokeWidth={settings.probeWidth}
                style={{
                  opacity: settings.probeFade ? 1 : settings.probeOpacity,
                }}
                x1={probeX(0)}
                x2={probeX(0)}
                y1={probeTop}
                y2={probeBottom}
              />
            </>
          )}

          {settings.showDots && settings.w1On && (
            <circle
              cx={probeX(0)}
              cy={waveFns.yW1(probeX(0))}
              fill={settings.dotColor}
              r={settings.dotRadius}
              ref={dot1Ref}
            />
          )}
          {settings.showDots && settings.w2On && (
            <circle
              cx={probeX(0)}
              cy={waveFns.yW2(probeX(0))}
              fill={settings.dotColor}
              r={settings.dotRadius}
              ref={dot2Ref}
            />
          )}
          {settings.showDots && settings.w3On && (
            <circle
              cx={probeX(0)}
              cy={waveFns.yW3(probeX(0))}
              fill={settings.dotColor}
              r={settings.dotRadius}
              ref={dot3Ref}
            />
          )}
        </g>
      </svg>
    </div>
  );
}
