"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// Smooth glide for the thumb/fill — critically damped, no overshoot, so the
// handle follows the pointer butterily and eases between snapped steps.
const SPRING_GLIDE = { stiffness: 700, damping: 50, mass: 0.5 } as const;
// Bouncy grab feedback for the thumb scale only.
const SPRING_BOUNCY = {
  type: "spring",
  stiffness: 500,
  damping: 14,
  mass: 0.7,
} as const;

export interface RangeSliderProps {
  "aria-label"?: string;
  className?: string;
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  /** Render a tick dot at each step. */
  showTicks?: boolean;
  step?: number;
  value?: number;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function RangeSlider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showTicks = true,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: RangeSliderProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const [active, setActive] = useState(false);
  const controlled = value !== undefined;
  const current = clamp(controlled ? value : internal, min, max);
  const percent = ((current - min) / (max - min)) * 100;

  // Spring-smoothed position drives both the thumb and the fill.
  const target = useMotionValue(percent);
  useEffect(() => {
    target.set(percent);
  }, [percent, target]);
  const smooth = useSpring(target, SPRING_GLIDE);
  const pos = reduce ? target : smooth;
  const left = useMotionTemplate`${pos}%`;
  // Self-offset the thumb from 0% (flush left) to -100% (flush right) of its
  // own width so it stays fully inside the track at both ends — no clip, no gap.
  const thumbX = useTransform(pos, (p) => `${-p}%`);

  const steps = Math.floor((max - min) / step);
  const ticks =
    showTicks && steps > 0 && steps <= 50
      ? Array.from({ length: steps + 1 }, (_, i) => min + i * step)
      : [];

  const commit = useCallback(
    (next: number) => {
      const snapped = clamp(
        Math.round((next - min) / step) * step + min,
        min,
        max
      );
      if (!controlled) {
        setInternal(snapped);
      }
      onValueChange?.(snapped);
    },
    [controlled, onValueChange, min, max, step]
  );

  const valueFromX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) {
        return current;
      }
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    },
    [current, min, max]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      setActive(true);
      commit(valueFromX(event.clientX));
    },
    [disabled, commit, valueFromX]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!active || disabled) {
        return;
      }
      commit(valueFromX(event.clientX));
    },
    [active, disabled, commit, valueFromX]
  );

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setActive(false);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      const map: Record<string, number> = {
        ArrowRight: current + step,
        ArrowUp: current + step,
        ArrowLeft: current - step,
        ArrowDown: current - step,
        Home: min,
        End: max,
      };
      if (event.key in map) {
        event.preventDefault();
        commit(map[event.key]);
      }
    },
    [disabled, current, step, min, max, commit]
  );

  return (
    <div
      className={cn(
        "relative flex h-10 w-full touch-none select-none items-center overflow-hidden rounded-lg bg-muted",
        disabled
          ? "pointer-events-none opacity-50"
          : "cursor-grab active:cursor-grabbing",
        className
      )}
      onPointerCancel={endDrag}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      ref={trackRef}
    >
      {/* fill — runs from the left edge to the thumb, consistent tone */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-foreground/15"
        style={{ width: left }}
      />

      {/* ticks — slight inset so the end dots don't clip */}
      <div className="pointer-events-none absolute inset-x-2 inset-y-0">
        {ticks.map((t) => {
          const tp = ((t - min) / (max - min)) * 100;
          return (
            <span
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
              key={t}
              style={{ left: `${tp}%` }}
            />
          );
        })}
      </div>

      {/* vertical bar thumb — contained at both ends via thumbX */}
      <motion.div
        animate={reduce ? undefined : { scaleY: active ? 1.35 : 1 }}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={current}
        className="absolute top-1/2 h-5 w-1.5 rounded-sm bg-foreground shadow-sm outline-none ring-foreground/30 focus-visible:ring-4"
        onKeyDown={onKeyDown}
        role="slider"
        style={{ left, x: thumbX, y: "-50%" }}
        tabIndex={disabled ? -1 : 0}
        transition={SPRING_BOUNCY}
      />
    </div>
  );
}
