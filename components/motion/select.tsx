"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

// Spring with bounce powers the unfold/separation; per-property timings in the
// content choreograph it (see SelectContent). Mirrors bouncy-accordion's feel.
const CHEVRON_TRANSITION: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.3,
};

const LIST_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};
const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

type Placement = "bottom" | "top";

interface SelectContextValue {
  disabled: boolean;
  labelFor: (value: string | undefined) => string | undefined;
  listId: string;
  open: boolean;
  placement: Placement;
  reduce: boolean;
  register: (value: string, label: string) => void;
  select: (value: string) => void;
  setOpen: (open: boolean) => void;
  setPlacement: (p: Placement) => void;
  triggerId: string;
  unregister: (value: string) => void;
  value: string | undefined;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Select>`);
  }
  return ctx;
}

export interface SelectProps {
  children: ReactNode;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  value?: string;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
}: SelectProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [labels, setLabels] = useState<Map<string, string>>(new Map());
  const [placement, setPlacement] = useState<Placement>("bottom");

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const select = useCallback(
    (next: string) => {
      if (!controlled) {
        setInternal(next);
      }
      onValueChange?.(next);
      setOpen(false);
    },
    [controlled, onValueChange]
  );

  const register = useCallback((v: string, label: string) => {
    setLabels((m) => (m.get(v) === label ? m : new Map(m).set(v, label)));
  }, []);
  const unregister = useCallback((v: string) => {
    setLabels((m) => {
      if (!m.has(v)) {
        return m;
      }
      const next = new Map(m);
      next.delete(v);
      return next;
    });
  }, []);

  // close on outside pointer / escape
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const ctx = useMemo<SelectContextValue>(
    () => ({
      value: current,
      open,
      setOpen,
      select,
      register,
      unregister,
      labelFor: (v) => (v === undefined ? undefined : labels.get(v)),
      reduce,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      disabled,
      placement,
      setPlacement,
    }),
    [
      current,
      open,
      select,
      register,
      unregister,
      labels,
      reduce,
      baseId,
      disabled,
      placement,
    ]
  );

  return (
    <SelectContext.Provider value={ctx}>
      <div className={cn("relative", className)} ref={rootRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const ctx = useSelectContext("SelectTrigger");
  const isTop = ctx.placement === "top";
  // edge facing the panel flattens then rounds; the far edge stays rounded.
  // All four corners are specified so none gets stranded when placement flips.
  const kf = ctx.open ? [0, 0, 12] : [12, 0, 12];
  let kfT: Transition = { duration: 0 };
  if (!ctx.reduce) {
    kfT = ctx.open
      ? { duration: 0.6, times: [0, 0.4, 1], ease: EASE_OUT }
      : { duration: 0.42, times: [0, 0.5, 1], ease: EASE_OUT };
  }
  const flatT: Transition = { duration: 0 };
  return (
    <motion.button
      animate={{
        borderTopLeftRadius: isTop ? kf : 12,
        borderTopRightRadius: isTop ? kf : 12,
        borderBottomLeftRadius: isTop ? 12 : kf,
        borderBottomRightRadius: isTop ? 12 : kf,
      }}
      aria-controls={ctx.listId}
      aria-expanded={ctx.open}
      aria-haspopup="listbox"
      className={cn(
        "relative z-10 flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-foreground text-sm outline-none transition-colors",
        "hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      disabled={ctx.disabled}
      id={ctx.triggerId}
      // Gooey: the edge facing the panel snaps flat (panel attached) then rounds
      // back once the panel pulls away — the two pinch apart.
      initial={false}
      onClick={() => ctx.setOpen(!ctx.open)}
      transition={{
        borderTopLeftRadius: isTop ? kfT : flatT,
        borderTopRightRadius: isTop ? kfT : flatT,
        borderBottomLeftRadius: isTop ? flatT : kfT,
        borderBottomRightRadius: isTop ? flatT : kfT,
      }}
      type="button"
    >
      {children}
      <motion.span
        animate={{ rotate: ctx.open ? 180 : 0 }}
        aria-hidden
        className="text-muted-foreground"
        transition={ctx.reduce ? { duration: 0 } : CHEVRON_TRANSITION}
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </motion.button>
  );
}

export interface SelectValueProps {
  className?: string;
  placeholder?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext("SelectValue");
  const label = ctx.labelFor(ctx.value);
  return (
    <span
      className={cn(
        label ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label ?? placeholder ?? "Select"}
    </span>
  );
}

export interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: cohesive layout + open/close animation logic, clearer kept together
export function SelectContent({ className, children }: SelectContentProps) {
  const ctx = useSelectContext("SelectContent");
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const open = ctx.open;
  const { setPlacement } = ctx;

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }
    const measure = () => setHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  });

  // On open, flip upward when there isn't room below and there's more above.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const trigger = document.getElementById(ctx.triggerId);
    const node = innerRef.current;
    if (!(trigger && node)) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const h = node.offsetHeight;
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    setPlacement(below < h + 16 && above > below ? "top" : "bottom");
  }, [open, ctx.triggerId, setPlacement]);

  // Specify EVERY corner + both margins each render. The near edge (facing the
  // trigger) animates flat->round and the gap opens on that side; the far edge
  // stays rounded and its margin pinned to 0. Setting all of them avoids a
  // stranded square corner when the placement flips between opens.
  const isTop = ctx.placement === "top";
  const nearGap = open ? 8 : 0;
  const nearRadius = open ? 12 : 0;

  const gapT: Transition = open
    ? { type: "spring", duration: 0.6, bounce: 0.5, delay: 0.12 }
    : { type: "spring", duration: 0.3, bounce: 0.1 };
  const radiusT: Transition = open
    ? { duration: 0.3, ease: EASE_OUT, delay: 0.14 }
    : { duration: 0.16, ease: EASE_OUT };
  const instant: Transition = { duration: 0 };

  // Items stay mounted (open just animates the panel) so each item's label
  // registration persists — otherwise the trigger would fall back to the
  // placeholder the moment the panel closes.
  return (
    <motion.div
      animate={
        ctx.reduce
          ? { opacity: open ? 1 : 0, height: open ? height : 0 }
          : {
              opacity: open ? 1 : 0,
              height: open ? height : 0,
              // gap opens on the side facing the trigger
              marginTop: isTop ? 0 : nearGap,
              marginBottom: isTop ? nearGap : 0,
              // near corners go flat->round; far corners stay rounded
              borderTopLeftRadius: isTop ? 12 : nearRadius,
              borderTopRightRadius: isTop ? 12 : nearRadius,
              borderBottomLeftRadius: isTop ? nearRadius : 12,
              borderBottomRightRadius: isTop ? nearRadius : 12,
            }
      }
      aria-hidden={!open}
      aria-labelledby={ctx.triggerId}
      // flush against the trigger, then separates into its own rounded pill;
      // sits above or below depending on available space
      className={cn(
        "absolute right-0 left-0 z-20 rounded-xl border border-border bg-background shadow-lg",
        isTop ? "bottom-full" : "top-full",
        className
      )}
      id={ctx.listId}
      initial={false}
      role="listbox"
      style={{
        transformOrigin: isTop ? "bottom" : "top",
        overflow: "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
      transition={
        ctx.reduce
          ? { duration: 0.12 }
          : {
              opacity: open
                ? { duration: 0.18 }
                : { duration: 0.16, delay: 0.12 },
              height: open
                ? { type: "spring", duration: 0.42, bounce: 0.14 }
                : { duration: 0.26, ease: EASE_OUT, delay: 0.14 },
              marginTop: isTop ? instant : gapT,
              marginBottom: isTop ? gapT : instant,
              borderTopLeftRadius: isTop ? instant : radiusT,
              borderTopRightRadius: isTop ? instant : radiusT,
              borderBottomLeftRadius: isTop ? radiusT : instant,
              borderBottomRightRadius: isTop ? radiusT : instant,
            }
      }
    >
      <motion.div
        animate={open ? "show" : "hidden"}
        className="p-1"
        initial={false}
        ref={innerRef}
        variants={ctx.reduce ? undefined : LIST_VARIANTS}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export interface SelectItemProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
}

export function SelectItem({
  value,
  disabled = false,
  className,
  children,
}: SelectItemProps) {
  const ctx = useSelectContext("SelectItem");
  const selected = ctx.value === value;
  const label = typeof children === "string" ? children : value;

  useLayoutEffect(() => {
    ctx.register(value, label);
    return () => ctx.unregister(value);
  }, [ctx.register, ctx.unregister, value, label]);

  return (
    <motion.li variants={ctx.reduce ? undefined : ITEM_VARIANTS}>
      <button
        aria-selected={selected}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors",
          selected
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        disabled={disabled}
        onClick={() => ctx.select(value)}
        role="option"
        type="button"
      >
        {children}
        {selected ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
      </button>
    </motion.li>
  );
}
