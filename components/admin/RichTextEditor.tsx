"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code2, Heading2, ImageIcon, Italic, LinkIcon, List, ListOrdered, Quote } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false })
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor: updatedEditor }) {
      onChange(updatedEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) editor.commands.setContent(value);
  }, [editor, value]);

  if (!editor) return <div className="min-h-48 rounded-[8px] border border-border bg-bg" />;

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-bg">
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface p-2">
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold"><Bold size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic"><Italic size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading"><Heading2 size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list"><List size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Ordered list"><ListOrdered size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Quote"><Quote size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Code block"><Code2 size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={addLink} aria-label="Link"><LinkIcon size={16} /></Button>
        <Button size="icon" variant="ghost" onClick={addImage} aria-label="Image"><ImageIcon size={16} /></Button>
      </div>
      <EditorContent editor={editor} className="prose-content min-h-64 max-w-none p-4 outline-none" />
    </div>
  );
}
