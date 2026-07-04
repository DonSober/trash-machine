"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Sidebar 002 — slide-in overlay sidebar with animated dash items and an
 * optional cursor-following video preview on hover. Public API: useSidebar002 /
 * Sidebar002 / Sidebar002Section / Sidebar002Item.
 */

// ─── Open/close context ─────────────────────────────────────────────────────

interface Sidebar002ContextValue {
  close: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const Sidebar002Context = createContext<Sidebar002ContextValue | null>(null);

export function useSidebar002() {
  const ctx = useContext(Sidebar002Context);
  if (!ctx) {
    throw new Error("useSidebar002 must be used within <Sidebar002Provider>");
  }
  return ctx;
}

export interface Sidebar002ProviderProps {
  children: React.ReactNode;
  /** Milliseconds the cursor must linger at the left edge. Default: 500 */
  edgeDelay?: number;
  /** Open the sidebar when the cursor hovers the left edge. Default: true */
  edgeTrigger?: boolean;
  /** Key that toggles the sidebar. Pass false to disable. Default: "s" */
  keyboardShortcut?: string | false;
}

export function Sidebar002Provider({
  children,
  keyboardShortcut = "s",
  edgeTrigger = true,
  edgeDelay = 500,
}: Sidebar002ProviderProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  // Keyboard shortcut
  useEffect(() => {
    if (keyboardShortcut === false) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";
      if (typing || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      if (e.key.toLowerCase() === keyboardShortcut.toLowerCase()) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardShortcut]);

  // Left-edge hover trigger
  useEffect(() => {
    if (!edgeTrigger) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    const onMove = (e: MouseEvent) => {
      if (e.clientX <= 16) {
        if (!timer) {
          timer = setTimeout(() => setOpen(true), edgeDelay);
        }
      } else {
        clear();
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clear();
    };
  }, [edgeTrigger, edgeDelay]);

  const value = useMemo(
    () => ({ open, toggle, setOpen, close }),
    [open, toggle, close]
  );

  return (
    <Sidebar002Context.Provider value={value}>
      {children}
    </Sidebar002Context.Provider>
  );
}

// ─── Hover context (cursor-following preview) ─────────────────────────────────

const noop = () => undefined;

const HoverContext = createContext<{
  hovered: string | null;
  preview: { src: string; x: number; y: number } | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (id: string | null) => void;
  setPreview: (preview: { src: string; x: number; y: number } | null) => void;
}>({
  hovered: null,
  preview: null,
  containerRef: { current: null },
  setHovered: noop,
  setPreview: noop,
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    src: string;
    x: number;
    y: number;
  } | null>(null);

  const value = useMemo(
    () => ({
      hovered,
      preview,
      containerRef,
      setHovered,
      setPreview,
    }),
    [hovered, preview, containerRef]
  );

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

function CursorPreview() {
  const { preview } = useContext(HoverContext);
  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none fixed z-[60] aspect-video w-56 overflow-hidden rounded-xl border border-border/60 bg-background shadow-2xl"
          exit={{ opacity: 0, scale: 0.96 }}
          initial={{ opacity: 0, scale: 0.96 }}
          key="sb002-preview"
          style={{ left: preview.x + 20, top: preview.y - 24 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        >
          <video
            autoPlay
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            src={preview.src}
          >
            <track kind="captions" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sidebar002Item ───────────────────────────────────────────────────────────

export interface Sidebar002ItemProps {
  className?: string;
  href: string;
  isActive: boolean;
  isNew?: boolean;
  label: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Optional video URL shown as a cursor-following preview on hover. */
  preview?: string;
}

export const Sidebar002Item = memo(function Sidebar002Item({
  href,
  label,
  isActive,
  isNew,
  preview,
  className,
  onClick,
}: Sidebar002ItemProps) {
  const { hovered, setHovered, setPreview } = useContext(HoverContext);
  const isHovered = hovered === href;

  const restingOpacity = hovered === null ? 0.55 : 0.3;
  const opacity = isActive || isHovered ? 1 : restingOpacity;

  let x = 0;
  if (isActive) {
    x = 8;
  } else if (isHovered) {
    x = 6;
  }

  let dashWidth = 18;
  if (isActive) {
    dashWidth = 0;
  } else if (isHovered) {
    dashWidth = 26;
  }

  return (
    <div className="relative">
      {isActive && (
        <motion.span
          animate={{ width: 23 }}
          className="pointer-events-none absolute top-1/2 left-[4px] z-10 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          layoutId="sb002-active-bar"
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      )}

      <motion.span
        animate={{ width: dashWidth }}
        className="pointer-events-none absolute top-1/2 left-0 h-px -translate-y-1/2 bg-foreground/50"
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <motion.span className="pointer-events-none absolute top-1/4 left-0 h-px w-[13px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute top-0 left-0 h-px w-[16px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute top-3/4 left-0 h-px w-[13px] bg-foreground/30" />

      <motion.div
        animate={{ opacity, x }}
        style={{ transformOrigin: "left center" }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        <Link
          className={cn(
            "relative flex select-none items-center gap-2 py-0.5 pr-3 pl-8 font-normal text-[16px] leading-[150%]",
            className
          )}
          href={href}
          onClick={onClick}
          onMouseEnter={() => setHovered(href)}
          onMouseLeave={() => {
            setHovered(null);
            if (preview) {
              setPreview(null);
            }
          }}
          onMouseMove={(e) => {
            if (preview) {
              setPreview({ src: preview, x: e.clientX, y: e.clientY });
            }
          }}
        >
          <span className="relative z-1 truncate">{label}</span>
          {isNew && (
            <span className="size-1.5 shrink-0 rounded-full bg-accent-pro" />
          )}
        </Link>
      </motion.div>
    </div>
  );
});

// ─── Sidebar002Section ────────────────────────────────────────────────────────

export interface Sidebar002SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Optional count shown next to the section label. */
  count?: number;
  label?: React.ReactNode;
}

export function Sidebar002Section({
  label,
  count,
  children,
  className,
}: Sidebar002SectionProps) {
  return (
    <div className={cn("mb-2 flex flex-col", className)}>
      {label && (
        <div className="flex items-center gap-2 px-0 py-4">
          <span className="font-medium text-[#E5E5E559] text-[16px] leading-[150%]">
            {label}
          </span>
          {count != null && (
            <span className="font-medium text-[#E5E5E540] text-[12px] tabular-nums leading-none">
              {count}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Sidebar002 (overlay) ─────────────────────────────────────────────────────

export interface Sidebar002Props {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  open: boolean;
  /** Drawer width in px. Default: 280 */
  width?: number;
}

export function Sidebar002({
  open,
  onClose,
  children,
  width = 280,
  className,
}: Sidebar002Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click (ignoring elements flagged data-sidebar002-toggle).
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (panelRef.current?.contains(target ?? null)) {
        return;
      }
      if (target?.closest("[data-sidebar002-toggle]")) {
        return;
      }
      onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose]);

  return (
    <HoverProvider containerRef={containerRef}>
      <AnimatePresence>
        {open && (
          // Transparent click-catcher — no page dim behind the drawer.
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="sb002-scrim"
            transition={{ duration: 0.2 }}
          />
        )}
        {open && (
          <motion.aside
            animate={{ x: 0 }}
            aria-label="Navigation"
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex flex-col font-[family-name:var(--font-geist-sans)]",
              className
            )}
            exit={{ x: -width }}
            initial={{ x: -width }}
            key="sb002-panel"
            ref={panelRef}
            style={{ width }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Strongest blur at the left edge, fading to none on the right. */}
            <ProgressiveBlur blurAmount={12} direction="to left" layers={6} />
            <div
              className="no-scrollbar relative z-10 flex-1 overflow-y-auto pt-32 pb-4"
              data-scroll-viewport
            >
              <div className="relative px-3" ref={containerRef}>
                {children}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <CursorPreview />
    </HoverProvider>
  );
}

// ─── Progressive blur ─────────────────────────────────────────────────────────

/**
 * Directional progressive blur (per skiper-ui/skiper41). Stacks several
 * backdrop-filter layers of increasing blur, each masked by a linear-gradient
 * so the blur ramps smoothly along `direction` rather than applying a single
 * flat blur. With `direction: "to left"` the blur is strongest at the left
 * edge and fades to none on the right.
 */
function ProgressiveBlur({
  direction = "to right",
  blurAmount = 8,
  layers = 5,
  className,
}: {
  direction?: "to right" | "to left" | "to top" | "to bottom";
  blurAmount?: number;
  layers?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {Array.from({ length: layers }, (_, i) => {
        // Layer i is revealed from `reveal%` onward toward the start of
        // `direction`; stacking the increasingly-blurred layers ramps the
        // total blur up toward the `direction` origin.
        const reveal = (i / layers) * 100;
        const fade = Math.min(reveal + 100 / layers, 100);
        const mask = `linear-gradient(${direction}, transparent ${reveal}%, black ${fade}%)`;
        const blur = blurAmount * ((i + 1) / layers);
        return (
          <div
            className="absolute inset-0"
            key={`blur-${i}`}
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Header / Footer slots ────────────────────────────────────────────────────

export function Sidebar002Header({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0 px-3 pt-2 pb-4", className)}>{children}</div>
  );
}

export function Sidebar002Footer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 border-border/50 border-t px-3 pt-3 pb-2",
        className
      )}
    >
      {children}
    </div>
  );
}
