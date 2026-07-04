import type { ReactNode } from "react";
import "./docs-pane.css";

interface DocsPaneProps {
  children: ReactNode;
  header?: ReactNode;
}

export function DocsPane({ header, children }: DocsPaneProps) {
  return (
    <div className="docs-pane">
      {header ? <div className="docs-pane__header">{header}</div> : null}
      <div className="docs-pane__scroll">{children}</div>
    </div>
  );
}

interface DocsSectionProps {
  children: ReactNode;
  className?: string;
  title: string;
}

export function DocsSection({ title, children, className }: DocsSectionProps) {
  return (
    <section
      className={className ? `docs-section ${className}` : "docs-section"}
    >
      <div className="docs-section__title-wrap">
        <h2 className="docs-section__title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function DocsBodyText({ children }: { children: ReactNode }) {
  return <div className="docs-section__body">{children}</div>;
}

export function DocsPanel({ children }: { children: ReactNode }) {
  return <div className="docs-panel">{children}</div>;
}

export function DocsPanelInner({ children }: { children: ReactNode }) {
  return <div className="docs-panel__inner">{children}</div>;
}

export function DocsPanelSurface({ children }: { children: ReactNode }) {
  return <div className="docs-panel__surface">{children}</div>;
}
