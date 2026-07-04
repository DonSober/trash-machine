import { describe, expect, it } from "vitest";
import { PROTOTYPES } from "@/prototypes/registry";
import type { ControlField } from "./control-schema";
import {
  CONTROL_LOADERS,
  loadPrototypeControls,
} from "./prototype-controls-loaders";

const CONTROL_FIELD_TYPES: ControlField<object>["type"][] = [
  "range",
  "toggle",
  "color",
  "select",
  "ease",
  "action",
];

const slugsWithControls = PROTOTYPES.filter((p) => p.hasControls).map(
  (p) => p.slug
);

describe("CONTROL_LOADERS", () => {
  it.each(
    slugsWithControls
  )("has a control loader for registry prototype %s with hasControls: true", (slug) => {
    expect(
      CONTROL_LOADERS[slug],
      `slug "${slug}" declares hasControls but has no loader`
    ).toBeDefined();
  });

  it("does not register loaders for prototypes without controls", () => {
    const withoutControls = PROTOTYPES.filter((p) => !p.hasControls);
    for (const p of withoutControls) {
      expect(
        CONTROL_LOADERS[p.slug],
        `slug "${p.slug}" has a loader but hasControls is not true`
      ).toBeUndefined();
    }
  });
});

describe("loadPrototypeControls", () => {
  it.each(
    slugsWithControls
  )("resolves a valid controls config for %s", async (slug) => {
    const config = await loadPrototypeControls(slug);
    expect(config).not.toBe(null);
    if (!config) {
      return;
    }

    expect(typeof config.defaults).toBe("object");
    expect(config.defaults).not.toBeNull();

    expect(Array.isArray(config.schema)).toBe(true);
    expect(config.schema.length).toBeGreaterThan(0);
    for (const group of config.schema) {
      expect(typeof group.title).toBe("string");
      expect(Array.isArray(group.controls)).toBe(true);
      for (const field of group.controls) {
        expect(CONTROL_FIELD_TYPES).toContain(field.type);
        expect(typeof field.key).toBe("string");
        expect(typeof field.label).toBe("string");
        if (field.type === "range") {
          expect(typeof field.min).toBe("number");
          expect(typeof field.max).toBe("number");
        }
        if (field.type === "select") {
          expect(Array.isArray(field.options)).toBe(true);
        }
        // Every non-action control must map to a key in defaults.
        if (field.type !== "action") {
          expect(
            field.key in config.defaults,
            `control key "${field.key}" for "${slug}" is missing from DEFAULTS`
          ).toBe(true);
        }
      }
    }

    expect(Array.isArray(config.tabs)).toBe(true);
    expect(config.tabs?.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown slug", async () => {
    await expect(loadPrototypeControls("does-not-exist")).resolves.toBeNull();
  });
});
