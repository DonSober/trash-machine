"use client";

import Link from "next/link";
import type { BreadcrumbItem } from "@/components/layout/page-header.types";
import { useShell } from "@/lib/shell-context";

interface PageHeaderProps {
  items: BreadcrumbItem[];
}

export function PageHeader({ items }: PageHeaderProps) {
  const { toggleSidebar } = useShell();

  return (
    <>
      <button
        aria-label="Toggle navigation"
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#e5e5e5]"
        data-sidebar002-toggle
        onClick={toggleSidebar}
        type="button"
      >
        <SidebarToggleIcon />
      </button>
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-wrap items-center gap-2.5"
      >
        {items.map((item, i) => (
          <span className="inline-flex items-center gap-2.5" key={item.label}>
            {i > 0 ? <ChevronIcon /> : null}
            {item.href ? (
              <Link
                className="text-[#e5e5e580] text-sm leading-[142.857%] transition-colors hover:text-[#e5e5e5]"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#e5e5e5] text-sm leading-[142.857%]">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

function SidebarToggleIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={20}
      viewBox="0 0 24 24"
      width={20}
    >
      <path
        d="M11 3H13C16.771 3 18.657 3 19.828 4.172C21 5.343 21 7.229 21 11V13C21 16.771 21 18.657 19.828 19.828C18.657 21 16.771 21 13 21H11C7.229 21 5.343 21 4.172 19.828C3 18.657 3 16.771 3 13V11C3 7.229 3 5.343 4.172 4.172C5.343 3 7.229 3 11 3Z"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        d="M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z"
        fill="#121212"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={14}
      viewBox="0 0 24 24"
      width={14}
    >
      <path
        d="M9 6C9 6 15 10.419 15 12C15 13.581 9 18 9 18"
        stroke="oklch(70.8% 0 0)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}
