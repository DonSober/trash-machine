import { describe, expect, it } from "vitest";
import {
  getVisiblePrototypes,
  shouldHideDrafts,
} from "./get-visible-prototypes";

describe("getVisiblePrototypes", () => {
  it("includes draft prototypes when HIDE_DRAFTS is not set", () => {
    const original = process.env.HIDE_DRAFTS;
    process.env.HIDE_DRAFTS = "";
    expect(shouldHideDrafts()).toBe(false);
    expect(getVisiblePrototypes().some((p) => p.status === "draft")).toBe(true);
    process.env.HIDE_DRAFTS = original;
  });

  it("filters draft prototypes when HIDE_DRAFTS is true", () => {
    const original = process.env.HIDE_DRAFTS;
    process.env.HIDE_DRAFTS = "true";
    expect(shouldHideDrafts()).toBe(true);
    expect(getVisiblePrototypes().every((p) => p.status !== "draft")).toBe(
      true
    );
    process.env.HIDE_DRAFTS = original;
  });
});
