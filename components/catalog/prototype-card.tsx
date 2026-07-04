import Link from "next/link";
import type { ViewMode } from "@/components/catalog/filter-bar";
import type { Prototype } from "@/prototypes/registry";

interface PrototypeCardProps {
  prototype: Prototype;
  viewMode: ViewMode;
}

export function PrototypeCard({ prototype, viewMode }: PrototypeCardProps) {
  const href = `/components/${prototype.slug}`;

  if (viewMode === "list") {
    return (
      <Link
        className="grid grid-cols-[180px_1fr_auto] items-center gap-3 border-[#ffffff0f] border-b px-3 py-3 text-inherit no-underline transition-colors last:border-b-0 hover:bg-[#ffffff08]"
        href={href}
      >
        <span className="font-medium text-[#e5e5e5] text-sm">
          {prototype.title}
        </span>
        <span className="text-[#a1a1a1] text-sm">{prototype.description}</span>
        {prototype.status === "draft" ? (
          <span className="catalog-card__draft">draft</span>
        ) : null}
      </Link>
    );
  }

  if (viewMode === "compact") {
    return (
      <Link
        className="inline-flex items-center rounded-[10px] bg-[#171717] px-3 py-1.5 text-[#a1a1a1] text-sm no-underline transition-colors hover:text-[#e5e5e5]"
        href={href}
      >
        {prototype.title}
        {prototype.status === "draft" ? (
          <span className="catalog-card__draft"> · draft</span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link className="catalog-card" href={href}>
      <div className="catalog-card__preview" />
      <div className="catalog-card__body">
        <span className="catalog-card__title">{prototype.title}</span>
        {prototype.description ? (
          <span className="catalog-card__desc">{prototype.description}</span>
        ) : null}
        {prototype.status === "draft" ? (
          <span className="catalog-card__draft">draft</span>
        ) : null}
      </div>
    </Link>
  );
}
