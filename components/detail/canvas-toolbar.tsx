"use client";

import type { ComponentProps } from "react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/motion/button/base";
import { cn } from "@/lib/utils";

interface CanvasToolbarProps {
  className?: string;
  onReset?: () => void;
  onScrollToDocs?: () => void;
}

export function CanvasToolbar({
  onReset,
  onScrollToDocs,
  className,
}: CanvasToolbarProps) {
  const viewportRef = useRef<HTMLElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const el = viewportRef.current?.closest("[data-viewport-root]");
    if (!(el && el instanceof HTMLElement)) {
      return;
    }
    // Fullscreen can be rejected (e.g. permissions); swallow the rejection.
    const request = document.fullscreenElement
      ? document.exitFullscreen().then(() => setFullscreen(false))
      : el.requestFullscreen().then(() => setFullscreen(true));
    request.catch(() => undefined);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-4 bottom-4 z-10 flex justify-end",
        className
      )}
      ref={(node) => {
        viewportRef.current = node;
      }}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        <ToolbarButton
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={toggleFullscreen}
        >
          ⛶
        </ToolbarButton>
        <ToolbarButton aria-label="Reset settings" onClick={onReset}>
          ↺
        </ToolbarButton>
        <ToolbarButton
          aria-label="Scroll to documentation"
          onClick={onScrollToDocs}
        >
          ⌘
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("size-8 rounded-full text-sm", className)}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  );
}
