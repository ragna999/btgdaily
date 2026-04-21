"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  defaultValue?: string;
  onChange: (html: string) => void;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active
          ? "bg-[var(--color-brand-black)] text-white"
          : "hover:bg-gray-100 text-[var(--color-brand-black)]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-[var(--color-border)] mx-1" />;
}

export default function RichEditor({ defaultValue, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-blue-600" } }),
      Placeholder.configure({ placeholder: "Tulis isi artikel di sini..." }),
    ],
    content: defaultValue ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-article min-h-[400px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    return () => { editor?.destroy(); };
  }, [editor]);

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("Masukkan URL:");
    if (!url) return;
    editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="border border-[var(--color-border)] focus-within:border-[var(--color-brand-black)] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <s>S</s>
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. List
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          " Quote
        </ToolbarButton>
        <ToolbarButton
          title="Link"
          onClick={setLink}
          active={editor.isActive("link")}
        >
          Link
        </ToolbarButton>
        <ToolbarButton
          title="Hapus Link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↪
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
