export interface PrototypeDocs {
  apiRows: {
    name: string;
    type: string;
    default: string;
    description: string;
  }[];
  fileTree: string[];
  notes: string[];
  usageCode: string;
}

const DOCS: Record<string, () => Promise<PrototypeDocs>> = {
  "card-stack": async () => {
    const mod = await import("@/prototypes/card-stack/docs");
    return {
      usageCode: mod.usageCode,
      apiRows: mod.apiRows,
      notes: mod.notes,
      fileTree: mod.fileTree,
    };
  },
  wavelength: async () => {
    const mod = await import("@/prototypes/wavelength/docs");
    return {
      usageCode: mod.usageCode,
      apiRows: mod.apiRows,
      notes: mod.notes,
      fileTree: mod.fileTree,
    };
  },
  "pixel-wave": async () => ({
    usageCode: `<iframe src="/prototypes/pixel-wave.html" title="Pixel Wave" />`,
    apiRows: [],
    notes: [
      "Standalone HTML prototype with Tweakpane controls embedded in the page.",
      "Open via the preview canvas on this detail page.",
    ],
    fileTree: ["public/prototypes/pixel-wave.html"],
  }),
  "orbit-dots": async () => ({
    usageCode: `import OrbitDots from "@/prototypes/orbit-dots/visual";\n\n<OrbitDots />`,
    apiRows: [
      {
        name: "count",
        type: "number",
        default: "12",
        description: "Number of orbiting dots.",
      },
      {
        name: "radius",
        type: "number",
        default: "80",
        description: "Orbit radius in pixels.",
      },
      {
        name: "duration",
        type: "number",
        default: "3",
        description: "Time in seconds for one full orbit revolution.",
      },
      {
        name: "playing",
        type: "boolean",
        default: "true",
        description: "Whether the orbit animation is running.",
      },
      {
        name: "dotSize",
        type: "number",
        default: "10",
        description: "Diameter of each dot in pixels.",
      },
      {
        name: "dotColor",
        type: "string",
        default: "#3B82F6",
        description: "Fill color of the orbiting dots.",
      },
    ],
    notes: ["Draft prototype — orbit animation via GSAP rotation."],
    fileTree: [
      "prototypes/orbit-dots/visual.tsx",
      "prototypes/orbit-dots/controls.ts",
    ],
  }),
};

export async function getPrototypeDocs(
  slug: string
): Promise<PrototypeDocs | null> {
  const loader = DOCS[slug];
  if (!loader) {
    return null;
  }
  return await loader();
}
