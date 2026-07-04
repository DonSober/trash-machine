import { CatalogPageClient } from "@/components/catalog/catalog-page-client";
import {
  getCategories,
  getVisiblePrototypes,
} from "@/lib/get-visible-prototypes";

export const metadata = {
  title: "Components — Trash Machine",
  description: "Browse interactive GSAP prototypes",
};

export default function ComponentsPage() {
  const prototypes = getVisiblePrototypes();
  const categories = getCategories();

  return <CatalogPageClient categories={categories} prototypes={prototypes} />;
}
