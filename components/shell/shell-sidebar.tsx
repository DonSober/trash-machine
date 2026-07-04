"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar002,
  Sidebar002Item,
  Sidebar002Section,
} from "@/components/unlumen-ui/sidebar-002";
import { useShell } from "@/lib/shell-context";
import {
  CATEGORY_LABELS,
  type Prototype,
  type PrototypeCategory,
} from "@/prototypes/registry";

interface ShellSidebarProps {
  prototypes: Prototype[];
}

/** Overlay navigation drawer, driven by the shell's sidebar state. */
export function ShellSidebar({ prototypes }: ShellSidebarProps) {
  const { sidebarOpen, closeSidebar } = useShell();
  const pathname = usePathname();
  const grouped = groupByCategory(prototypes);

  return (
    <Sidebar002 onClose={closeSidebar} open={sidebarOpen}>
      {grouped.map(([category, items]) => (
        <Sidebar002Section
          count={items.length}
          key={category}
          label={CATEGORY_LABELS[category]}
        >
          {items.map((item) => {
            const href = `/components/${item.slug}`;
            return (
              <Sidebar002Item
                href={href}
                isActive={pathname === href}
                isNew={item.status === "draft"}
                key={item.slug}
                label={item.title}
              />
            );
          })}
        </Sidebar002Section>
      ))}
    </Sidebar002>
  );
}

function groupByCategory(prototypes: Prototype[]) {
  const map = new Map<PrototypeCategory, Prototype[]>();
  for (const p of prototypes) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return [...map.entries()];
}
