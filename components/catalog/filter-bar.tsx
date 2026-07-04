"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  type PrototypeCategory,
  type PrototypeStatus,
} from "@/prototypes/registry";

export type ViewMode = "cards" | "compact" | "list";
export type SortMode = "default" | "newest";
export type StatusFilter = "all" | PrototypeStatus;

interface FilterBarProps {
  categories: PrototypeCategory[];
  category: PrototypeCategory | "all";
  onCategoryChange: (value: PrototypeCategory | "all") => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortMode) => void;
  onStatusChange: (value: StatusFilter) => void;
  onViewModeChange: (value: ViewMode) => void;
  search: string;
  sort: SortMode;
  status: StatusFilter;
  viewMode: ViewMode;
}

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  categories,
}: FilterBarProps) {
  return (
    <div className="flex w-full max-w-[672px] flex-col gap-3">
      <div className="catalog-filters">
        <div className="catalog-search-wrap">
          <SearchIcon />
          <div className="catalog-search">
            <input
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search... (or just explore)"
              type="search"
              value={search}
            />
          </div>
        </div>
        <SegmentGroup
          onChange={(v) => onCategoryChange(v as PrototypeCategory | "all")}
          options={[
            { value: "all", label: "All" },
            ...categories.map((cat) => ({
              value: cat,
              label: CATEGORY_LABELS[cat],
            })),
          ]}
          value={category}
        />
      </div>
      <div className="catalog-filters">
        <SegmentGroup
          onChange={(v) => onStatusChange(v as StatusFilter)}
          options={[
            { value: "all", label: "All status" },
            { value: "stable", label: "stable" },
            { value: "draft", label: "draft" },
          ]}
          value={status}
        />
        <SegmentGroup
          onChange={(v) => onSortChange(v as SortMode)}
          options={[
            { value: "default", label: "Default" },
            { value: "newest", label: "Newest" },
          ]}
          value={sort}
        />
        <SegmentGroup
          onChange={(v) => onViewModeChange(v as ViewMode)}
          options={[
            { value: "cards", label: "Cards" },
            { value: "compact", label: "Compact" },
            { value: "list", label: "List" },
          ]}
          value={viewMode}
        />
      </div>
    </div>
  );
}

function SegmentGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ width: number; x: number }>();

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const active = track.querySelector<HTMLButtonElement>(
      '[data-active="true"]'
    );
    if (!active) {
      return;
    }
    setIndicator({ width: active.offsetWidth, x: active.offsetLeft });
  }, [value, options]);

  return (
    <div className="catalog-segment">
      <div className="catalog-segment-track" ref={trackRef}>
        {indicator ? (
          <span
            className="catalog-segment-indicator"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.x}px)`,
            }}
          />
        ) : null}
        {options.map((option) => (
          <button
            className="catalog-segment-btn"
            data-active={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth={1.75}
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.75}
      />
    </svg>
  );
}
