'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Palette
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  return (
    <div className="editor-toolbar">
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-button ${editor.isActive('underline') ? 'is-active' : ''}`}
        title="Underline"
      >
        <UnderlineIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
        title="Inline Code"
      >
        <Code size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Block elements */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`toolbar-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
        title="Code Block"
      >
        <Code size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Links and media */}
      <button
        onClick={setLink}
        className={`toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
        title="Add Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        onClick={addImage}
        className="toolbar-button"
        title="Add Image"
      >
        <ImageIcon size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Colors */}
      <div className="relative group">
        <button
          className="toolbar-button"
          title="Text Color"
        >
          <Palette size={16} />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="grid grid-cols-6 gap-1">
            {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#ffc0cb'].map((color) => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative group">
        <button
          className="toolbar-button"
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="grid grid-cols-6 gap-1">
            {['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fef2f2', '#f3e8ff'].map((color) => (
              <button
                key={color}
                onClick={() => setHighlight(color)}
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing your story...',
  className = '' 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-muted-foreground hover:decoration-foreground',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!isMounted) {
    return (
      <div className={`border border-border rounded-md overflow-hidden ${className}`}>
        <div className="editor-toolbar">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Loading editor...</span>
          </div>
        </div>
        <div className="p-4 min-h-[200px] bg-background">
          <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-border rounded-md overflow-hidden ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
} 