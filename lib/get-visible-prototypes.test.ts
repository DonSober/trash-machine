import { afterEach, describe, expect, it } from "vitest";
import { PROTOTYPES } from "@/prototypes/registry";
import {
  getCategories,
  getPrototypeBySlug,
  getPrototypesByCategory,
  getVisiblePrototypes,
  shouldHideDrafts,
} from "./get-visible-prototypes";

const ORIGINAL_HIDE_DRAFTS = process.env.HIDE_DRAFTS;

afterEach(() => {
  process.env.HIDE_DRAFTS = ORIGINAL_HIDE_DRAFTS;
});

const draftPrototype = PROTOTYPES.find((p) => p.status === "draft");
const stablePrototype = PROTOTYPES.find((p) => p.status === "stable");

describe("getVisiblePrototypes", () => {
  it("includes draft prototypes when HIDE_DRAFTS is not set", () => {
    process.env.HIDE_DRAFTS = "";
    expect(shouldHideDrafts()).toBe(false);
    expect(getVisiblePrototypes().some((p) => p.status === "draft")).toBe(true);
  });

  it("filters draft prototypes when HIDE_DRAFTS is true", () => {
    process.env.HIDE_DRAFTS = "true";
    expect(shouldHideDrafts()).toBe(true);
    expect(getVisiblePrototypes().every((p) => p.status !== "draft")).toBe(
      true
    );
  });
});

describe("getPrototypeBySlug", () => {
  it("returns the prototype matching the slug", () => {
    process.env.HIDE_DRAFTS = "";
    if (!stablePrototype) {
      throw new Error("registry has no stable prototype to test against");
    }
    const found = getPrototypeBySlug(stablePrototype.slug);
    expect(found).toBe(stablePrototype);
  });

  it("returns undefined for an unknown slug", () => {
    process.env.HIDE_DRAFTS = "";
    expect(getPrototypeBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns draft prototypes when drafts are visible", () => {
    process.env.HIDE_DRAFTS = "";
    if (!draftPrototype) {
      throw new Error("registry has no draft prototype to test against");
    }
    expect(getPrototypeBySlug(draftPrototype.slug)).toBe(draftPrototype);
  });

  it("returns undefined for draft prototypes when HIDE_DRAFTS is true", () => {
    process.env.HIDE_DRAFTS = "true";
    if (!draftPrototype) {
      throw new Error("registry has no draft prototype to test against");
    }
    expect(getPrototypeBySlug(draftPrototype.slug)).toBeUndefined();
  });
});

describe("getCategories", () => {
  it("returns each category from the registry exactly once", () => {
    process.env.HIDE_DRAFTS = "";
    const categories = getCategories();
    const expected = [...new Set(PROTOTYPES.map((p) => p.category))];
    expect(categories).toEqual(expected);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("omits categories that only contain drafts when HIDE_DRAFTS is true", () => {
    process.env.HIDE_DRAFTS = "true";
    const categories = getCategories();
    const expected = [
      ...new Set(
        PROTOTYPES.filter((p) => p.status !== "draft").map((p) => p.category)
      ),
    ];
    expect(categories).toEqual(expected);
  });
});

describe("getPrototypesByCategory", () => {
  it("returns only prototypes in the given category", () => {
    process.env.HIDE_DRAFTS = "";
    for (const category of getCategories()) {
      const inCategory = getPrototypesByCategory(category);
      expect(inCategory.length).toBeGreaterThan(0);
      expect(inCategory.every((p) => p.category === category)).toBe(true);
    }
  });

  it("excludes drafts when HIDE_DRAFTS is true", () => {
    if (!draftPrototype) {
      throw new Error("registry has no draft prototype to test against");
    }
    process.env.HIDE_DRAFTS = "true";
    const inCategory = getPrototypesByCategory(draftPrototype.category);
    expect(inCategory.some((p) => p.slug === draftPrototype.slug)).toBe(false);
    expect(inCategory.every((p) => p.status !== "draft")).toBe(true);
  });
});
