import type { ComponentType } from "react";

export const PROTOTYPE_LOADERS: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "card-stack": () => import("./card-stack/visual"),
  wavelength: () => import("./wavelength/visual"),
  "orbit-dots": () => import("./orbit-dots/visual"),
};
