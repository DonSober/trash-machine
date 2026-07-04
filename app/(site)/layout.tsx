import { AppShell } from "@/components/shell/app-shell";
import { getVisiblePrototypes } from "@/lib/get-visible-prototypes";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prototypes = getVisiblePrototypes();

  return <AppShell prototypes={prototypes}>{children}</AppShell>;
}
