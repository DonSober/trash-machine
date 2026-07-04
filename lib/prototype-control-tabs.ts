/**
 * Per-prototype control dock tabs. Prototypes can export CONTROL_TABS from
 * controls.ts to override the default boilerplate.
 */
export type PrototypeControlTabKind = "schema" | "ui" | "custom";

export interface PrototypeControlTab {
  id: string;
  kind: PrototypeControlTabKind;
  label: string;
}

export const DEFAULT_CONTROL_TABS: PrototypeControlTab[] = [
  { id: "prototype", label: "Prototype", kind: "schema" },
  { id: "ui", label: "UI", kind: "ui" },
];
