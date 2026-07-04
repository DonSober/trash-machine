"use client";

import { useMemo, useState } from "react";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { CategorySection } from "@/components/catalog/category-section";
import {
  FilterBar,
  type SortMode,
  type StatusFilter,
  type ViewMode,
} from "@/components/catalog/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { PlaygroundLayout } from "@/components/layout/playground-layout";
import {
  CATEGORY_LABELS,
  type Prototype,
  type PrototypeCategory,
} from "@/prototypes/registry";

interface CatalogPageClientProps {
  categories: PrototypeCategory[];
  prototypes: Prototype[];
}

export function CatalogPageClient({
  prototypes,
  categories,
}: CatalogPageClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PrototypeCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortMode>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const filtered = useMemo(() => {
    let list = [...prototypes];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (status !== "all") {
      list = list.filter((p) => p.status === status);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [prototypes, category, status, search, sort]);

  const byCategory = useMemo(() => {
    const map = new Map<PrototypeCategory, Prototype[]>();
    for (const p of filtered) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return map;
  }, [filtered]);

  return (
    <PlaygroundLayout
      header={<PageHeader items={[{ label: "Components" }]} />}
      left={
        <>
          <CatalogHero />
          <FilterBar
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onStatusChange={setStatus}
            onViewModeChange={setViewMode}
            search={search}
            sort={sort}
            status={status}
            viewMode={viewMode}
          />
          {filtered.length === 0 ? (
            <p className="docs-section__body">
              No prototypes match your filters.
            </p>
          ) : (
            [...byCategory.entries()].map(([cat, items]) => (
              <CategorySection
                description={
                  items[0]?.categoryDescription ?? CATEGORY_LABELS[cat]
                }
                key={cat}
                prototypes={items}
                title={CATEGORY_LABELS[cat]}
                viewMode={viewMode}
              />
            ))
          )}
        </>
      }
    />
  );
}
