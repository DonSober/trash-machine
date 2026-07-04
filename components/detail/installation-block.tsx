"use client";

import { useMemo, useState } from "react";
import {
  DocsPanel,
  DocsPanelInner,
  DocsPanelSurface,
} from "@/components/layout/docs-pane";

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
type PackageManager = (typeof MANAGERS)[number];

interface InstallationBlockProps {
  slug: string;
}

export function InstallationBlock({ slug }: InstallationBlockProps) {
  const [manager, setManager] = useState<PackageManager>("npm");

  const commands = useMemo(
    () => ({
      npm: `# Copy prototype into your project\nprototypes/${slug}/`,
      pnpm: `# Copy prototype into your project\nprototypes/${slug}/`,
      yarn: `# Copy prototype into your project\nprototypes/${slug}/`,
      bun: `# Copy prototype into your project\nprototypes/${slug}/`,
    }),
    [slug]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(commands[manager]);
  };

  return (
    <DocsPanel>
      <div className="docs-install-tabs">
        <div className="docs-install-tablist">
          {MANAGERS.map((item) => (
            <button
              className="docs-install-tab"
              data-active={manager === item}
              key={item}
              onClick={() => setManager(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <button
          aria-label="Copy install command"
          className="docs-copy-btn static mr-[-4px] shrink-0"
          onClick={copy}
          type="button"
        >
          <CopyIcon />
        </button>
      </div>
      <DocsPanelInner>
        <DocsPanelSurface>
          <pre className="docs-code">{commands[manager]}</pre>
        </DocsPanelSurface>
      </DocsPanelInner>
    </DocsPanel>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={14}
      viewBox="0 0 24 24"
      width={14}
    >
      <rect
        height={14}
        rx={2}
        stroke="#E5E5E5"
        strokeWidth={2}
        width={14}
        x={8}
        y={8}
      />
      <path
        d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
        stroke="#E5E5E5"
        strokeWidth={2}
      />
    </svg>
  );
}
