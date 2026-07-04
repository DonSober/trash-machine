import { CodeBlock } from "@/components/detail/code-block";
import { FileTree } from "@/components/detail/file-tree";
import { InstallationBlock } from "@/components/detail/installation-block";
import { DocsBodyText, DocsSection } from "@/components/layout/docs-pane";
import type { Prototype } from "@/prototypes/registry";

interface DocsSectionsProps {
  apiRows: {
    name: string;
    type: string;
    default: string;
    description: string;
  }[];
  fileTree: string[];
  notes: string[];
  prototype: Prototype;
  usageCode: string;
}

export function DocsSections({
  prototype,
  usageCode,
  apiRows,
  notes,
  fileTree,
}: DocsSectionsProps) {
  return (
    <article>
      <DocsSection title="Installation">
        <InstallationBlock slug={prototype.slug} />
      </DocsSection>

      <DocsSection title="File structure">
        <FileTree paths={fileTree} />
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="API reference">
        {apiRows.length > 0 ? (
          <div className="w-full px-1">
            {apiRows.map((row) => (
              <div className="docs-api-row" key={row.name}>
                <div>
                  <div className="docs-api-name">{row.name}</div>
                  <div className="docs-api-desc">{row.description}</div>
                </div>
                <div className="docs-api-meta">
                  {row.type} · default {row.default}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DocsBodyText>
            <p>
              This prototype is fully self-contained and exposes no props. Demo
              data, animation settings, and internal state are managed
              internally.
            </p>
          </DocsBodyText>
        )}
      </DocsSection>

      <DocsSection title="Notes">
        <DocsBodyText>
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </DocsBodyText>
      </DocsSection>
    </article>
  );
}
