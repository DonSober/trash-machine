import { notFound } from "next/navigation";
import { PrototypeDetailClient } from "@/components/detail/prototype-detail-client";
import { getPrototypeDocs } from "@/lib/get-prototype-docs";
import {
  getPrototypeBySlug,
  getVisiblePrototypes,
} from "@/lib/get-visible-prototypes";
import { loadPrototypeControls } from "@/lib/prototype-controls-loaders";

export function generateStaticParams() {
  return getVisiblePrototypes().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prototype = getPrototypeBySlug(slug);
  return {
    title: prototype ? `${prototype.title} — Trash Machine` : "Trash Machine",
    description: prototype?.description,
  };
}

export default async function PrototypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prototype = getPrototypeBySlug(slug);

  if (!prototype) {
    notFound();
  }

  const [docs, controls] = await Promise.all([
    getPrototypeDocs(slug),
    prototype.hasControls ? loadPrototypeControls(slug) : Promise.resolve(null),
  ]);

  return (
    <PrototypeDetailClient
      controls={controls}
      docs={docs}
      prototype={prototype}
    />
  );
}
