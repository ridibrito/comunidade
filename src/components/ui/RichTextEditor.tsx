"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { useEffect, useState } from 'react';

// Verificar se estamos no cliente
const isBrowser = typeof window !== 'undefined';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Digite aqui...",
  className = ""
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] text-light-text dark:text-dark-text',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  }, [mounted]);

  useEffect(() => {
    if (editor && mounted && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor, mounted]);

  if (!isBrowser || !mounted || !editor) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="border-b bg-light-surface dark:bg-dark-surface p-2 flex items-center gap-2 flex-wrap">
          <div className="w-8 h-8 bg-light-border dark:bg-dark-border rounded animate-pulse" />
          <div className="w-8 h-8 bg-light-border dark:bg-dark-border rounded animate-pulse" />
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 min-h-[200px]">
          <div className="h-4 bg-light-border dark:bg-dark-border rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-light-border dark:bg-dark-border rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-light-surface dark:bg-dark-surface p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-light-background dark:hover:bg-dark-background ${
            editor.isActive('bold') ? 'bg-brand-accent/20' : ''
          }`}
          title="Negrito"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-light-background dark:hover:bg-dark-background ${
            editor.isActive('italic') ? 'bg-brand-accent/20' : ''
          }`}
          title="Itálico"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-light-border dark:bg-dark-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-light-background dark:hover:bg-dark-background ${
            editor.isActive('bulletList') ? 'bg-brand-accent/20' : ''
          }`}
          title="Lista com marcadores"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-light-background dark:hover:bg-dark-background ${
            editor.isActive('orderedList') ? 'bg-brand-accent/20' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-light-border dark:bg-dark-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-light-background dark:hover:bg-dark-background"
          title="Desfazer"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-light-background dark:hover:bg-dark-background"
          title="Refazer"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-light-surface dark:bg-dark-surface p-4">
        <EditorContent 
          editor={editor}
          className="min-h-[200px] text-light-text dark:text-dark-text
            [&_.tiptap]:outline-none
            [&_p]:mb-2 [&_p:last-child]:mb-0
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-4
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
            [&_strong]:font-bold
            [&_em]:italic
            [&_br]:block
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-2
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-2
            [&_li]:mb-1
            [&_.is-empty::before]:content-[attr(data-placeholder)] 
            [&_.is-empty::before]:text-light-muted 
            [&_.is-empty::before]:dark:text-dark-muted 
            [&_.is-empty::before]:float-left 
            [&_.is-empty::before]:pointer-events-none 
            [&_.is-empty::before]:h-0"
        />
      </div>
    </div>
  );
}
