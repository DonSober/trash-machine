"use client";

import { useRef } from "react";
import { DocsSections } from "@/components/detail/docs-sections";
import { ViewportFrame } from "@/components/detail/viewport-frame";
import { PageHeader } from "@/components/layout/page-header";
import { PlaygroundLayout } from "@/components/layout/playground-layout";
import type { PrototypeDocs } from "@/lib/get-prototype-docs";
import { DEFAULT_CONTROL_TABS } from "@/lib/prototype-control-tabs";
import type { PrototypeControlsConfig } from "@/lib/prototype-controls-loaders";
import { PrototypeSettingsProvider } from "@/lib/prototype-settings-context";
import type { Prototype } from "@/prototypes/registry";

interface PrototypeDetailClientProps {
  controls: PrototypeControlsConfig | null;
  docs: PrototypeDocs | null;
  prototype: Prototype;
}

export function PrototypeDetailClient({
  prototype,
  docs,
  controls,
}: PrototypeDetailClientProps) {
  const docsRef = useRef<HTMLDivElement>(null);

  const scrollToDocs = () => {
    docsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const viewport = (
    <ViewportFrame
      onScrollToDocs={scrollToDocs}
      prototype={prototype}
      showControls={controls != null}
    />
  );

  const content = (
    <PlaygroundLayout
      header={
        <PageHeader
          items={[
            { label: "Components", href: "/components" },
            { label: prototype.title },
          ]}
        />
      }
      left={
        docs ? (
          <div ref={docsRef}>
            <DocsSections
              apiRows={docs.apiRows}
              fileTree={docs.fileTree}
              notes={docs.notes}
              prototype={prototype}
              usageCode={docs.usageCode}
            />
          </div>
        ) : (
          <p className="docs-section__body">
            No documentation available for this prototype.
          </p>
        )
      }
      mobileViewportFirst
      right={viewport}
    />
  );

  if (!controls) {
    return content;
  }

  return (
    <PrototypeSettingsProvider
      defaults={controls.defaults}
      schema={controls.schema}
      slug={prototype.slug}
      tabs={controls.tabs ?? DEFAULT_CONTROL_TABS}
    >
      {content}
    </PrototypeSettingsProvider>
  );
}
