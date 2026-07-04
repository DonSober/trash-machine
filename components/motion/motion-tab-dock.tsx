"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
// biome-ignore lint/performance/noNamespaceImport: React namespace import used throughout
import * as React from "react";
import useMeasure from "react-use-measure";
import {
  Highlight,
  HighlightItem,
} from "@/components/unlumen-ui/primitives/effects/highlight";
import { cn } from "@/lib/utils";

type Spring = Transition;

interface ContentRecord {
  children: React.ReactNode;
  className?: string;
}

interface TriggerRecord {
  label: string;
  value: string;
}

interface MotionTabDockContextValue {
  activeValue: string;
  closeMenu: () => void;
  contentRef: React.RefObject<Record<string, ContentRecord>>;
  direction: number;
  openValue: (value: string) => void;
  spring: Spring;
  triggersRef: React.RefObject<Record<string, TriggerRecord>>;
}

interface MotionTabDockItemContextValue {
  value: string;
}

const MotionTabDockContext =
  React.createContext<MotionTabDockContextValue | null>(null);

const MotionTabDockItemContext =
  React.createContext<MotionTabDockItemContextValue | null>(null);

function useTabDock() {
  const context = React.useContext(MotionTabDockContext);
  if (!context) {
    throw new Error("MotionTabDock.* must be used inside <MotionTabDock>");
  }
  return context;
}

function useTabDockItem() {
  const context = React.useContext(MotionTabDockItemContext);
  if (!context) {
    throw new Error(
      "MotionTabDockTrigger and MotionTabDockContent must be used inside <MotionTabDockItem>"
    );
  }
  return context;
}

const springTransition = {
  type: "spring",
  stiffness: 350,
  damping: 32,
  bounce: 0,
} as const satisfies Transition;

const LABEL_DELAY_S = 0.08;

const contentVariants = {
  initial: (direction: number) => ({ x: `${100 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${-100 * direction}%`, opacity: 0 }),
};

const TAB_GAP_PX = 4;
const TAB_LIST_PADDING_X = 8;
const TAB_BUTTON_MIN_PX = 36;
const TAB_BUTTON_PADDING_X = 12;
const TAB_CHAR_WIDTH_PX = 7.8;

function estimateLabelWidth(label: string) {
  return label.length * TAB_CHAR_WIDTH_PX;
}

function estimateTriggerWidth(label: string, active: boolean) {
  if (!active) {
    return TAB_BUTTON_MIN_PX;
  }

  return Math.max(
    TAB_BUTTON_MIN_PX,
    TAB_BUTTON_PADDING_X * 2 + estimateLabelWidth(label)
  );
}

function computeToolbarWidth(triggers: TriggerRecord[], activeValue: string) {
  if (triggers.length === 0) {
    return TAB_LIST_PADDING_X * 2 + TAB_BUTTON_MIN_PX * 2 + TAB_GAP_PX;
  }

  return (
    TAB_LIST_PADDING_X * 2 +
    triggers.reduce((total, trigger, index) => {
      const gap = index > 0 ? TAB_GAP_PX : 0;
      const active = trigger.value === activeValue;
      return total + gap + estimateTriggerWidth(trigger.label, active);
    }, 0)
  );
}

type MotionTabDockProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "onValueChange"
> & {
  viewportClassName?: string;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

function MotionTabDock({
  className,
  children,
  viewportClassName,
  springBounce = 0,
  springStiffness = 350,
  springDamping = 32,
  value,
  onValueChange,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MotionTabDockProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const triggersRef = React.useRef<Record<string, TriggerRecord>>({});
  const contentRef = React.useRef<Record<string, ContentRecord>>({});
  const lastActiveValueRef = React.useRef(value ?? "");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const [direction, setDirection] = React.useState(1);

  const activeValue = value ?? internalValue;

  const spring = React.useMemo<Spring>(
    () => ({
      type: "spring",
      bounce: springBounce,
      stiffness: springStiffness,
      damping: springDamping,
    }),
    [springBounce, springStiffness, springDamping]
  );

  const setContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const setActiveValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const closeMenu = React.useCallback(() => {
    lastActiveValueRef.current = "";
    setActiveValue("");
  }, [setActiveValue]);

  const openValue = React.useCallback(
    (nextValue: string) => {
      if (!nextValue || nextValue === lastActiveValueRef.current) {
        return;
      }

      const itemValues = Object.keys(triggersRef.current);
      const previousIndex = itemValues.indexOf(lastActiveValueRef.current);
      const nextIndex = itemValues.indexOf(nextValue);

      if (previousIndex !== -1 && nextIndex !== -1) {
        setDirection(nextIndex > previousIndex ? 1 : -1);
      }

      lastActiveValueRef.current = nextValue;
      setActiveValue(nextValue);
    },
    [setActiveValue]
  );

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (!value) {
      lastActiveValueRef.current = "";
      return;
    }

    openValue(value);
  }, [openValue, value]);

  React.useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      const container = containerRef.current;

      if (
        container &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [closeMenu]);

  const contextValue = React.useMemo(
    () => ({
      activeValue,
      direction,
      spring,
      triggersRef,
      contentRef,
      openValue,
      closeMenu,
    }),
    [activeValue, closeMenu, direction, openValue, spring]
  );

  return (
    <MotionTabDockContext.Provider value={contextValue}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: container coordinates menu keyboard/pointer events, not a clickable widget */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: container coordinates menu keyboard/pointer events, not a clickable widget */}
      <div
        className={cn(
          "relative flex w-full flex-col-reverse items-center",
          className
        )}
        data-slot="tab-dock"
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.key === "Escape") {
            closeMenu();
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);

          const related = event.relatedTarget;
          if (
            related instanceof Node &&
            event.currentTarget.contains(related)
          ) {
            return;
          }

          closeMenu();
        }}
        ref={setContainerRef}
        {...props}
      >
        {children}
        <MotionTabDockViewport className={viewportClassName} />
      </div>
    </MotionTabDockContext.Provider>
  );
}

function MotionTabDockList({
  className,
  highlightClassName,
  children,
}: {
  className?: string;
  highlightClassName?: string;
  children: React.ReactNode;
}) {
  const { activeValue, triggersRef } = useTabDock();
  const [toolbarWidth, setToolbarWidth] = React.useState(() =>
    computeToolbarWidth([], activeValue)
  );

  React.useLayoutEffect(() => {
    setToolbarWidth(
      computeToolbarWidth(Object.values(triggersRef.current), activeValue)
    );
  }, [activeValue, children, triggersRef]);

  return (
    <Highlight
      className={cn(
        "pointer-events-none rounded-full bg-primary/10",
        highlightClassName
      )}
      containerClassName="relative rounded-full"
      controlledItems
      hover
      mode="parent"
      style={{ zIndex: -1 }}
    >
      <motion.ul
        animate={{ width: toolbarWidth }}
        className={cn(
          "relative z-10 flex list-none items-center gap-1 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur-sm",
          className
        )}
        data-slot="tab-dock-list"
        initial={false}
        transition={springTransition}
      >
        {children}
      </motion.ul>
    </Highlight>
  );
}

function MotionTabDockItem({
  className,
  value,
  children,
  ...props
}: React.ComponentPropsWithRef<"li"> & {
  value: string;
}) {
  const itemContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MotionTabDockItemContext.Provider value={itemContextValue}>
      <li
        className={cn("relative", className)}
        data-slot="tab-dock-item"
        data-value={value}
        {...props}
      >
        {children}
      </li>
    </MotionTabDockItemContext.Provider>
  );
}

function MotionTabDockTrigger({
  className,
  children,
  icon,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { activeValue, closeMenu, openValue, triggersRef } = useTabDock();
  const { value } = useTabDockItem();
  const label = String(children);
  const isOpen = activeValue === value;
  const labelWidth = estimateLabelWidth(label);

  triggersRef.current[value] = { value, label };

  React.useEffect(
    () => () => {
      delete triggersRef.current[value];
    },
    [triggersRef, value]
  );

  const width = estimateTriggerWidth(label, isOpen);

  return (
    <HighlightItem asChild>
      <motion.button
        animate={{ width }}
        aria-expanded={isOpen}
        aria-label={label}
        aria-selected={isOpen}
        className={cn(
          "relative inline-flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-full px-2 font-medium text-muted-foreground text-sm outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground",
          className
        )}
        data-slot="tab-dock-trigger"
        data-state={isOpen ? "open" : "closed"}
        initial={false}
        onClick={(event) => {
          onClick?.(event);

          if (isOpen) {
            closeMenu();
            return;
          }

          openValue(value);
        }}
        onFocus={() => {
          openValue(value);
        }}
        onMouseEnter={() => {
          openValue(value);
        }}
        role="tab"
        style={{ minWidth: TAB_BUTTON_MIN_PX }}
        transition={springTransition}
        type="button"
        whileTap={{ scaleY: 0.8 }}
      >
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {icon ? (
            <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {icon}
            </span>
          ) : (
            <span className="inline-flex size-4 shrink-0 items-center justify-center font-semibold text-xs uppercase">
              {label.charAt(0)}
            </span>
          )}
          <motion.span
            animate={{
              opacity: isOpen ? 1 : 0,
              maxWidth: isOpen ? labelWidth : 0,
            }}
            className="overflow-hidden whitespace-nowrap"
            initial={false}
            transition={{
              ...springTransition,
              delay: isOpen ? LABEL_DELAY_S : 0,
            }}
          >
            {label}
          </motion.span>
        </span>
      </motion.button>
    </HighlightItem>
  );
}

function MotionTabDockContent({
  className,
  children,
}: React.ComponentPropsWithRef<"div">) {
  const { contentRef } = useTabDock();
  const { value } = useTabDockItem();

  contentRef.current[value] = { children, className };

  React.useEffect(
    () => () => {
      delete contentRef.current[value];
    },
    [contentRef, value]
  );

  return null;
}

function MotionTabDockViewport({ className }: { className?: string }) {
  const { activeValue, contentRef, direction, spring, triggersRef } =
    useTabDock();
  const [measureRef, bounds] = useMeasure({ offsetSize: true });
  const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 });

  const activeContent = activeValue
    ? contentRef.current[activeValue]
    : undefined;
  const toolbarWidth = computeToolbarWidth(
    Object.values(triggersRef.current),
    activeValue
  );

  React.useLayoutEffect(() => {
    if (bounds.width <= 0 && bounds.height <= 0) {
      return;
    }

    setLastSize({
      width: bounds.width,
      height: bounds.height,
    });
  }, [bounds.height, bounds.width]);

  const measuredWidth = bounds.width > 0 ? bounds.width : lastSize.width;
  const measuredHeight = bounds.height > 0 ? bounds.height : lastSize.height;
  const isOpen = Boolean(activeContent && activeValue);
  const viewportWidth = isOpen ? Math.max(measuredWidth, toolbarWidth) : 0;
  const viewportHeight = isOpen ? measuredHeight : 0;

  return (
    <motion.div
      animate={{
        width: viewportWidth,
        height: viewportHeight,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.95,
      }}
      className={cn(
        "w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur-sm",
        className
      )}
      data-slot="tab-dock-viewport"
      initial={false}
      transition={spring}
    >
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        {activeContent && activeValue ? (
          <motion.div
            animate="active"
            className={cn("w-full", activeContent.className)}
            custom={direction}
            exit="exit"
            initial="initial"
            key={activeValue}
            transition={spring}
            variants={contentVariants}
          >
            <div ref={measureRef}>{activeContent.children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export {
  MotionTabDock,
  MotionTabDockContent,
  MotionTabDockItem,
  MotionTabDockList,
  MotionTabDockTrigger,
};
