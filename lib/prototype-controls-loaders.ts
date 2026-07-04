import type { ControlGroup } from "@/lib/control-schema";
import type { PrototypeControlTab } from "@/lib/prototype-control-tabs";
import { DEFAULT_CONTROL_TABS } from "@/lib/prototype-control-tabs";

export interface PrototypeControlsConfig<T extends object = object> {
  defaults: T;
  schema: ControlGroup<T>[];
  tabs?: PrototypeControlTab[];
}

interface ControlsModule<T extends object> {
  CONTROL_TABS?: PrototypeControlTab[];
  DEFAULTS: T;
  SCHEMA: ControlGroup<T>[];
}

export const CONTROL_LOADERS: Record<
  string,
  () => Promise<ControlsModule<object>>
> = {
  "card-stack": () =>
    import("@/prototypes/card-stack/controls") as Promise<
      ControlsModule<object>
    >,
  wavelength: () =>
    import("@/prototypes/wavelength/controls") as Promise<
      ControlsModule<object>
    >,
  "orbit-dots": () =>
    import("@/prototypes/orbit-dots/controls") as Promise<
      ControlsModule<object>
    >,
};

export async function loadPrototypeControls(
  slug: string
): Promise<PrototypeControlsConfig | null> {
  const loader = CONTROL_LOADERS[slug];
  if (!loader) {
    return null;
  }
  const mod = await loader();
  return {
    defaults: mod.DEFAULTS,
    schema: mod.SCHEMA,
    tabs: mod.CONTROL_TABS ?? DEFAULT_CONTROL_TABS,
  };
}
