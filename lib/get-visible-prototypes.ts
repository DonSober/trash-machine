import {
  PROTOTYPES,
  type Prototype,
  type PrototypeCategory,
} from "@/prototypes/registry";

export function shouldHideDrafts(): boolean {
  return process.env.HIDE_DRAFTS === "true";
}

export function getVisiblePrototypes(): Prototype[] {
  if (shouldHideDrafts()) {
    return PROTOTYPES.filter((p) => p.status !== "draft");
  }
  return PROTOTYPES;
}

export function getPrototypeBySlug(slug: string): Prototype | undefined {
  return getVisiblePrototypes().find((p) => p.slug === slug);
}

export function getCategoryDescription(category: PrototypeCategory): string {
  const match = getVisiblePrototypes().find(
    (p) => p.category === category && p.categoryDescription
  );
  return match?.categoryDescription ?? "";
}

export function getPrototypesByCategory(
  category: PrototypeCategory
): Prototype[] {
  return getVisiblePrototypes().filter((p) => p.category === category);
}

export function getCategories(): PrototypeCategory[] {
  const seen = new Set<PrototypeCategory>();
  for (const p of getVisiblePrototypes()) {
    seen.add(p.category);
  }
  return [...seen];
}

export function getAdjacentInCategory(slug: string): {
  prev: Prototype | null;
  next: Prototype | null;
} {
  const current = getPrototypeBySlug(slug);
  if (!current) {
    return { prev: null, next: null };
  }
  const inCategory = getPrototypesByCategory(current.category);
  const index = inCategory.findIndex((p) => p.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: inCategory[(index - 1 + inCategory.length) % inCategory.length],
    next: inCategory[(index + 1) % inCategory.length],
  };
}
