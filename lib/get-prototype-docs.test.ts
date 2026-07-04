import { describe, expect, it } from "vitest";
import { PROTOTYPES } from "@/prototypes/registry";
import { getPrototypeDocs } from "./get-prototype-docs";

describe("getPrototypeDocs", () => {
  it.each(
    PROTOTYPES.map((p) => p.slug)
  )("returns docs with the expected shape for registry slug %s", async (slug) => {
    const docs = await getPrototypeDocs(slug);
    expect(docs, `slug "${slug}" is registered but has no docs`).not.toBe(null);
    if (!docs) {
      return;
    }

    expect(typeof docs.usageCode).toBe("string");
    expect(docs.usageCode.length).toBeGreaterThan(0);

    expect(Array.isArray(docs.apiRows)).toBe(true);
    for (const row of docs.apiRows) {
      expect(typeof row.name).toBe("string");
      expect(typeof row.type).toBe("string");
      expect(typeof row.default).toBe("string");
      expect(typeof row.description).toBe("string");
    }

    expect(Array.isArray(docs.notes)).toBe(true);
    expect(docs.notes.every((note) => typeof note === "string")).toBe(true);

    expect(Array.isArray(docs.fileTree)).toBe(true);
    expect(docs.fileTree.length).toBeGreaterThan(0);
    expect(docs.fileTree.every((entry) => typeof entry === "string")).toBe(
      true
    );
  });

  it("returns null for an unknown slug", async () => {
    await expect(getPrototypeDocs("does-not-exist")).resolves.toBeNull();
  });
});
