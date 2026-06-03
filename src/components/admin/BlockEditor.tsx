"use client";

import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  imagePlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  frontmatterPlugin,
  directivesPlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  AdmonitionDirectiveDescriptor,
  InsertCodeBlock,
  InsertAdmonition,
} from "@mdxeditor/editor";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useEffect } from "react";
import { uploadImage } from "@/lib/firebase";

interface BlockEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  slug: string;
}

export default function BlockEditor({ markdown, onChange, slug }: BlockEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  // We only want to set initial markdown once, or when it drastically changes from outside,
  // but MDXEditor handles its own internal state well.
  
  const handleImageUpload = async (file: File): Promise<string> => {
    if (!slug) {
      alert("Please provide a title to generate a slug before uploading images.");
      return "";
    }
    try {
      const path = `posts/${slug}/inline-${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      return url;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
      return "";
    }
  };

  return (
    <div className="mdx-editor-wrapper">
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="prose max-w-none w-full outline-none p-6 min-h-[500px]"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          imagePlugin({
            imageUploadHandler: handleImageUpload,
          }),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript', jsx: 'React (JSX)', tsx: 'React (TSX)', css: 'CSS', html: 'HTML', py: 'Python', bash: 'Bash', json: 'JSON', txt: 'Text', yaml: 'YAML', md: 'Markdown', sql: 'SQL', go: 'Go', rs: 'Rust' } }),
          frontmatterPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", padding: "4px" }}>
                <UndoRedo />
                <div style={{ width: 1, height: 24, background: "var(--cms-border-soft)", margin: "0 4px" }} />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <div style={{ width: 1, height: 24, background: "var(--cms-border-soft)", margin: "0 4px" }} />
                <ListsToggle />
                <div style={{ width: 1, height: 24, background: "var(--cms-border-soft)", margin: "0 4px" }} />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
                <div style={{ width: 1, height: 24, background: "var(--cms-border-soft)", margin: "0 4px" }} />
                <InsertCodeBlock />
                <InsertAdmonition />
              </div>
            )
          })
        ]}
      />
      <style jsx global>{`
        .mdx-editor-wrapper .mdxeditor {
          font-family: var(--font-sans);
        }
        .mdx-editor-wrapper [data-lexical-editor] {
          outline: none !important;
          border: 1px solid var(--studio-border);
          border-radius: var(--studio-r-lg);
          background: var(--studio-surface);
          box-shadow: var(--studio-shadow-sm);
        }
        .mdx-editor-wrapper [data-lexical-editor] p {
          margin-bottom: 1.5em;
          line-height: 1.8;
          font-size: 1.0625rem;
        }
        .mdx-editor-wrapper .mdxeditor-toolbar {
          background: var(--studio-surface);
          border: 1px solid var(--studio-border);
          box-shadow: var(--studio-shadow-sm);
          padding: 8px;
          position: sticky;
          top: 1rem;
          z-index: 20;
          border-radius: var(--studio-r-lg);
          margin-bottom: 2rem;
        }
        .dark .mdx-editor-wrapper .mdxeditor-toolbar {
          background: var(--studio-surface-raised);
        }
      `}</style>
    </div>
  );
}
