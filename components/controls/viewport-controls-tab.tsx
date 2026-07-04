"use client";

import { Button } from "@/components/motion/button/base";

interface ViewportControlsTabProps {
  onReset: () => void;
}

/**
 * Boilerplate UI/viewport controls. Prototypes can replace this tab via
 * CONTROL_TABS + custom tab kind later.
 */
export function ViewportControlsTab({ onReset }: ViewportControlsTabProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-muted-foreground text-xs">
        Viewport controls are shared across prototypes. Per-prototype UI tabs
        can be added via CONTROL_TABS in controls.ts.
      </p>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
          Stage
        </span>
        <Button
          className="justify-start"
          onClick={onReset}
          size="sm"
          type="button"
          variant="outline"
        >
          Reset settings
        </Button>
        <Button
          className="justify-start"
          disabled
          size="sm"
          type="button"
          variant="outline"
        >
          Fullscreen (coming soon)
        </Button>
      </div>
    </div>
  );
}
