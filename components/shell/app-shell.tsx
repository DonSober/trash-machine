"use client";

import { useEffect } from "react";
import { CommandMenu } from "@/components/shell/command-menu";
import { ShellSidebar } from "@/components/shell/shell-sidebar";
import { ShellProvider, useShell } from "@/lib/shell-context";
import type { Prototype } from "@/prototypes/registry";

interface AppShellProps {
  children: React.ReactNode;
  prototypes: Prototype[];
}

export function AppShell({ children, prototypes }: AppShellProps) {
  return (
    <ShellProvider>
      <AppShellInner prototypes={prototypes}>{children}</AppShellInner>
    </ShellProvider>
  );
}

function AppShellInner({ children, prototypes }: AppShellProps) {
  const { searchOpen, setSearchOpen } = useShell();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#121212] text-[#e5e5e5]">
      <ShellSidebar prototypes={prototypes} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
      <CommandMenu
        onOpenChange={setSearchOpen}
        open={searchOpen}
        prototypes={prototypes}
      />
    </div>
  );
}
