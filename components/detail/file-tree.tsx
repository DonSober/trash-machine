import { DocsPanel, DocsPanelInner } from "@/components/layout/docs-pane";

interface FileTreeProps {
  paths: string[];
}

interface TreeNode {
  children: Map<string, TreeNode>;
  isFile: boolean;
  name: string;
}

export function FileTree({ paths }: FileTreeProps) {
  const root = buildTree(paths);

  return (
    <DocsPanel>
      <DocsPanelInner>
        <div className="docs-file-tree">
          <FileTreeRow depth={0} isFile={false} name="trash-machine" />
          <div className="docs-file-children">{renderNode(root, 1)}</div>
        </div>
      </DocsPanelInner>
    </DocsPanel>
  );
}

function renderNode(node: TreeNode, depth: number) {
  const entries = [...node.children.entries()].sort(
    ([a, nodeA], [b, nodeB]) => {
      if (nodeA.isFile !== nodeB.isFile) {
        return nodeA.isFile ? 1 : -1;
      }
      return a.localeCompare(b);
    }
  );

  return entries.map(([name, child]) => (
    <div key={name}>
      <FileTreeRow
        depth={depth}
        ext={child.isFile ? getExt(name) : undefined}
        isFile={child.isFile}
        name={name}
      />
      {child.children.size > 0 ? (
        <div className="docs-file-children">{renderNode(child, depth + 1)}</div>
      ) : null}
    </div>
  ));
}

function FileTreeRow({
  name,
  isFile,
  ext,
}: {
  name: string;
  isFile: boolean;
  depth: number;
  ext?: string;
}) {
  return (
    <div
      className="docs-file-row"
      data-ext={ext}
      data-kind={isFile ? "file" : "folder"}
    >
      {(() => {
        if (!isFile) {
          return <FolderIcon />;
        }
        return ext === "ts" ? <TsFileIcon /> : <TsxFileIcon />;
      })()}
      <span>{name}</span>
    </div>
  );
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", children: new Map(), isFile: false };

  for (const rawPath of paths) {
    const parts = rawPath.split("/").filter(Boolean);
    let current = root;

    for (const [i, part] of parts.entries()) {
      const isFile = i === parts.length - 1;
      let child = current.children.get(part);
      if (!child) {
        child = { name: part, children: new Map(), isFile };
        current.children.set(part, child);
      }
      current = child;
    }
  }

  return root;
}

function getExt(name: string) {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx + 1) : undefined;
}

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={18}
      viewBox="0 0 24 24"
      width={18}
    >
      <path
        d="M2 19V7.549C2 6.105 2 5.383 2.243 4.816C2.547 4.11 3.11 3.547 3.816 3.243C4.383 3 5.098 3 6.549 3H7.043C7.648 3 8.221 3.274 8.6 3.745L10.418 6M10.418 6H16C17.4 6 18.1 6 18.635 6.272C19.105 6.512 19.488 6.895 19.727 7.365C20 7.9 20 8.6 20 10V11M10.418 6H7"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M3.158 15.514L3.456 14.772C4.19 12.945 4.557 12.032 5.322 11.516C6.088 11 7.076 11 9.052 11H17.112C19.8 11 21.145 11 21.742 11.879C22.34 12.758 21.84 14 20.842 16.486L20.544 17.228C19.81 19.055 19.443 19.968 18.678 20.484C17.912 21 16.924 21 14.948 21H6.888C4.2 21 2.855 21 2.258 20.121C1.66 19.242 2.16 18 3.158 15.514Z"
        stroke="#E5E5E5"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function TsxFileIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={18}
      viewBox="0 0 24 24"
      width={18}
    >
      <path
        d="M8 17H16"
        stroke="#FB64B6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8 13H12"
        stroke="#FB64B6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M13 2.5V3C13 5.828 13 7.243 13.879 8.121C14.757 9 16.172 9 19 9H19.5M20 10.657V14C20 17.771 20 19.657 18.828 20.828C17.657 22 15.771 22 12 22C8.229 22 6.343 22 5.172 20.828C4 19.657 4 17.771 4 14V9.456C4 6.211 4 4.588 4.886 3.489C5.065 3.267 5.267 3.065 5.489 2.886C6.588 2 8.211 2 11.456 2C12.161 2 12.514 2 12.837 2.114C12.904 2.138 12.97 2.165 13.034 2.196C13.344 2.344 13.593 2.593 14.092 3.092L18.828 7.828C19.407 8.406 19.695 8.696 19.848 9.063C20 9.431 20 9.839 20 10.657Z"
        stroke="#FB64B6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function TsFileIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={18}
      viewBox="0 0 24 24"
      width={18}
    >
      <path
        d="M8 17H16"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8 13H12"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M13 2.5V3C13 5.828 13 7.243 13.879 8.121C14.757 9 16.172 9 19 9H19.5M20 10.657V14C20 17.771 20 19.657 18.828 20.828C17.657 22 15.771 22 12 22C8.229 22 6.343 22 5.172 20.828C4 19.657 4 17.771 4 14V9.456C4 6.211 4 4.588 4.886 3.489C5.065 3.267 5.267 3.065 5.489 2.886C6.588 2 8.211 2 11.456 2C12.161 2 12.514 2 12.837 2.114C12.904 2.138 12.97 2.165 13.034 2.196C13.344 2.344 13.593 2.593 14.092 3.092L18.828 7.828C19.407 8.406 19.695 8.696 19.848 9.063C20 9.431 20 9.839 20 10.657Z"
        stroke="#E5E5E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}
