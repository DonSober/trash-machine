"use client";

import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  ControlPanelFields,
  ControlPanelHeader,
} from "@/components/controls/control-panel";
import { ViewportControlsTab } from "@/components/controls/viewport-controls-tab";
import {
  MotionTabDock,
  MotionTabDockContent,
  MotionTabDockItem,
  MotionTabDockList,
  MotionTabDockTrigger,
} from "@/components/motion/motion-tab-dock";
import { usePrototypeSettings } from "@/lib/prototype-settings-context";
import { cn } from "@/lib/utils";

interface ControlDockProps {
  className?: string;
}

const TAB_ICONS: Record<string, ReactNode> = {
  prototype: <SlidersHorizontal aria-hidden />,
  ui: <LayoutGrid aria-hidden />,
};

export function ControlDock({ className }: ControlDockProps) {
  const { settings, schema, tabs, onChange, save, reset, dispatchAction } =
    usePrototypeSettings();
  const [activeTab, setActiveTab] = useState("");

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-4 bottom-4 z-10 flex justify-center",
        className
      )}
    >
      <div className="pointer-events-auto w-full max-w-[320px]">
        <MotionTabDock
          onValueChange={setActiveTab}
          value={activeTab}
          viewportClassName="max-h-[min(70vh,560px)] overflow-y-auto"
        >
          <MotionTabDockList>
            {tabs.map((tab) => (
              <MotionTabDockItem key={tab.id} value={tab.id}>
                <MotionTabDockTrigger icon={TAB_ICONS[tab.id]}>
                  {tab.label}
                </MotionTabDockTrigger>
                <MotionTabDockContent className="p-0">
                  {(() => {
                    if (tab.kind === "schema") {
                      return (
                        <div className="flex flex-col">
                          <ControlPanelHeader onReset={reset} onSave={save} />
                          <ControlPanelFields
                            onAction={dispatchAction}
                            onChange={onChange}
                            schema={schema}
                            settings={settings}
                          />
                        </div>
                      );
                    }
                    if (tab.kind === "ui") {
                      return <ViewportControlsTab onReset={reset} />;
                    }
                    return (
                      <div className="p-4 text-muted-foreground text-sm">
                        Custom tab — extend via CONTROL_TABS in controls.ts
                      </div>
                    );
                  })()}
                </MotionTabDockContent>
              </MotionTabDockItem>
            ))}
          </MotionTabDockList>
        </MotionTabDock>
      </div>
    </div>
  );
}
