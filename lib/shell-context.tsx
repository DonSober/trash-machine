"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ShellContextValue {
  closeSidebar: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  /** Overlay nav drawer state. */
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const value = useMemo(
    () => ({
      searchOpen,
      setSearchOpen,
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
    }),
    [searchOpen, sidebarOpen, toggleSidebar, closeSidebar]
  );

  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used within ShellProvider");
  }
  return ctx;
}
