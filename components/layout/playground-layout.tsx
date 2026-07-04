import type { ReactNode } from "react";
import { DocsPane } from "@/components/layout/docs-pane";
import { cn } from "@/lib/utils";

interface PlaygroundLayoutProps {
  className?: string;
  header: ReactNode;
  left: ReactNode;
  /** On small screens, show viewport (right) above docs (left). */
  mobileViewportFirst?: boolean;
  right?: ReactNode;
}

export function PlaygroundLayout({
  header,
  left,
  right,
  mobileViewportFirst = false,
  className,
}: PlaygroundLayoutProps) {
  const hasRight = right != null;

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-[#121212]", className)}>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col lg:grid lg:overflow-hidden",
          hasRight && "lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)]"
        )}
      >
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-col overflow-hidden",
            mobileViewportFirst && hasRight && "order-2 lg:order-1",
            !hasRight && "lg:col-span-full"
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DocsPane header={header}>{left}</DocsPane>
          </div>
        </div>
        {hasRight ? (
          <div
            className={cn(
              "relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#121212]",
              mobileViewportFirst &&
                "order-1 border-[#ffffff0f] border-b lg:order-2 lg:border-b-0 lg:border-l",
              !mobileViewportFirst && "lg:border-[#ffffff0f] lg:border-l"
            )}
          >
            {right}
          </div>
        ) : null}
      </div>
    </div>
  );
}
