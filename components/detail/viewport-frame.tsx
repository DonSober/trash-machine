"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { CanvasToolbar } from "@/components/detail/canvas-toolbar";
import { ControlDock } from "@/components/detail/control-dock";
import { usePrototypeSettings } from "@/lib/prototype-settings-context";
import { cn } from "@/lib/utils";
import { PROTOTYPE_LOADERS } from "@/prototypes/loaders";
import type { Prototype } from "@/prototypes/registry";

const VisualLoading = () => (
  <div className="flex flex-1 items-center justify-center bg-[#161616] text-muted-foreground text-sm">
    Loading…
  </div>
);

// Wrap each prototype loader in next/dynamic once at module scope. Calling
// dynamic() inside the render body would create a new lazy component every
// render, remounting the prototype and re-running its GSAP setup.
const dynamicVisualCache = new Map<string, ComponentType>();

function getDynamicVisual(slug: string): ComponentType | null {
  const loader = PROTOTYPE_LOADERS[slug];
  if (!loader) {
    return null;
  }
  let Visual = dynamicVisualCache.get(slug);
  if (!Visual) {
    Visual = dynamic(loader, { ssr: false, loading: VisualLoading });
    dynamicVisualCache.set(slug, Visual);
  }
  return Visual;
}

interface ViewportFrameProps {
  className?: string;
  onScrollToDocs?: () => void;
  prototype: Prototype;
  showControls?: boolean;
}

export function ViewportFrame({
  prototype,
  onScrollToDocs,
  showControls = false,
  className,
}: ViewportFrameProps) {
  if (prototype.kind === "iframe" && prototype.src) {
    return (
      <div
        className={cn(
          "relative flex min-h-[280px] flex-1 flex-col bg-[#161616] lg:min-h-0",
          className
        )}
        data-viewport-root
      >
        <iframe
          className="min-h-[280px] flex-1 border-0 lg:min-h-0"
          src={prototype.src}
          title={prototype.title}
        />
      </div>
    );
  }

  const Visual = getDynamicVisual(prototype.slug);
  if (!Visual) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#161616] p-12 text-muted-foreground text-sm">
        Prototype not registered in loaders.ts
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-none bg-[#161616] lg:m-4 lg:min-h-0 lg:rounded-xl",
        className
      )}
      data-viewport-root
    >
      <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden">
        <Visual />
      </div>
      {showControls ? (
        <>
          <ControlDock />
          <ConnectedCanvasToolbar onScrollToDocs={onScrollToDocs} />
        </>
      ) : (
        <CanvasToolbar onScrollToDocs={onScrollToDocs} />
      )}
    </div>
  );
}

function ConnectedCanvasToolbar({
  onScrollToDocs,
}: {
  onScrollToDocs?: () => void;
}) {
  const { reset } = usePrototypeSettings();
  return <CanvasToolbar onReset={reset} onScrollToDocs={onScrollToDocs} />;
}
