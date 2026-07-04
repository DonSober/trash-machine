"use client";

import { useState } from "react";
import {
  DocsPanel,
  DocsPanelInner,
  DocsPanelSurface,
} from "@/components/layout/docs-pane";

interface CodeBlockProps {
  className?: string;
  code: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className ?? "docs-code-block"}>
      <DocsPanel>
        <DocsPanelInner>
          <DocsPanelSurface>
            <pre className="docs-code">{code}</pre>
          </DocsPanelSurface>
        </DocsPanelInner>
        <button
          aria-label={copied ? "Copied" : "Copy code"}
          className="docs-copy-btn"
          onClick={copy}
          type="button"
        >
          <CopyIcon />
        </button>
      </DocsPanel>
    </div>
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
      <path
        d="M9 15C9 12.172 9 10.757 9.879 9.879C10.757 9 12.172 9 15 9L16 9C18.828 9 20.243 9 21.121 9.879C22 10.757 22 12.172 22 15V16C22 18.828 22 20.243 21.121 21.121C20.243 22 18.828 22 16 22H15C12.172 22 10.757 22 9.879 21.121C9 20.243 9 18.828 9 16L9 15Z"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M17 9C16.997 6.043 16.953 4.511 16.092 3.462C15.926 3.26 15.74 3.074 15.538 2.908C14.431 2 12.787 2 9.5 2C6.213 2 4.569 2 3.462 2.908C3.26 3.074 3.074 3.26 2.908 3.462C2 4.569 2 6.213 2 9.5C2 12.787 2 14.431 2.908 15.538C3.074 15.74 3.26 15.926 3.462 16.092C4.511 16.953 6.043 16.997 9 17"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}
