import type { ViewMode } from "@/components/catalog/filter-bar";
import { PrototypeCard } from "@/components/catalog/prototype-card";
import { cn } from "@/lib/utils";
import type { Prototype } from "@/prototypes/registry";

interface CategorySectionProps {
  description?: string;
  prototypes: Prototype[];
  title: string;
  viewMode: ViewMode;
}

export function CategorySection({
  title,
  description,
  prototypes,
  viewMode,
}: CategorySectionProps) {
  if (prototypes.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[783px]">
      <header className="mb-5">
        <h2 className="catalog-category-title">{title}</h2>
        {description ? (
          <p className="catalog-category-desc">{description}</p>
        ) : null}
      </header>
      <div
        className={cn(
          viewMode === "cards" &&
            "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3",
          viewMode === "compact" && "flex flex-wrap gap-2",
          viewMode === "list" &&
            "flex flex-col overflow-clip rounded-[14px] border border-[#ffffff0f] bg-[#171717]"
        )}
      >
        {prototypes.map((p) => (
          <PrototypeCard key={p.slug} prototype={p} viewMode={viewMode} />
        ))}
      </div>
    </section>
  );
}
