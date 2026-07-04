"use client";

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

  // Cmd/Ctrl+K is owned by CommandPalette (always mounted via CommandMenu),
  // which toggles open state through onOpenChange.
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
