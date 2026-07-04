"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  type CommandItem,
  CommandPalette,
} from "@/components/motion/command-palette";
import type { Prototype } from "@/prototypes/registry";
import { CATEGORY_LABELS } from "@/prototypes/registry";

interface CommandMenuProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  prototypes: Prototype[];
}

export function CommandMenu({
  open,
  onOpenChange,
  prototypes,
}: CommandMenuProps) {
  const router = useRouter();

  const items = useMemo((): CommandItem[] => {
    const prototypeItems: CommandItem[] = prototypes.map((p) => ({
      id: p.slug,
      label: p.title,
      group: CATEGORY_LABELS[p.category],
      keywords: p.tags,
      badge:
        p.status === "draft" ? (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            draft
          </span>
        ) : undefined,
      onSelect: () => router.push(`/components/${p.slug}`),
    }));

    return [
      ...prototypeItems,
      {
        id: "catalog",
        label: "Browse all components",
        group: "Catalog",
        keywords: ["components", "catalog", "browse"],
        onSelect: () => router.push("/components"),
      },
    ];
  }, [prototypes, router]);

  return (
    <CommandPalette
      emptyMessage="No prototypes found."
      items={items}
      onOpenChange={onOpenChange}
      open={open}
      placeholder="Search prototypes…"
    />
  );
}
