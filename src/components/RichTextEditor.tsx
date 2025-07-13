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
  Palette,
  Upload,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ 
  editor, 
  showLanguageDropdown, 
  setShowLanguageDropdown 
}: { 
  editor: any; 
  showLanguageDropdown: boolean; 
  setShowLanguageDropdown: (show: boolean) => void;
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [languageSearch, setLanguageSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      if (linkText) {
        // Insert new link with custom text
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        // Apply link to selected text
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
    }
  };

  const setLink = () => {
    const selectedText = editor.getText();
    setLinkText(selectedText);
    setShowLinkInput(true);
    // Focus the URL input after a short delay
    setTimeout(() => {
      linkInputRef.current?.focus();
    }, 100);
  };

  const cancelLink = () => {
    setLinkUrl('');
    setLinkText('');
    setShowLinkInput(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setShowImageUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    if (imagePreview) {
      editor.chain().focus().setImage({ src: imagePreview }).run();
      setImageFile(null);
      setImagePreview('');
      setShowImageUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setImagePreview('');
    setShowImageUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  // Handle click outside and escape key to close dropdowns and modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
        setLanguageSearch('');
      }
      
      // Close link modal if clicking outside
      if (showLinkInput && !(event.target as Element)?.closest('.link-modal')) {
        cancelLink();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLanguageDropdown(false);
        setLanguageSearch('');
        if (showLinkInput) {
          cancelLink();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLinkInput]);

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
      
      {/* Code Block with Language Selection */}
      <div className="relative" ref={languageDropdownRef}>
        <button
          onClick={() => {
            if (editor.isActive('codeBlock')) {
              setShowLanguageDropdown(!showLanguageDropdown);
            } else {
              editor.chain().focus().toggleCodeBlock().run();
            }
          }}
          className={`toolbar-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          title="Code Block"
        >
          <Code size={16} />
          {editor.isActive('codeBlock') && editor.getAttributes('codeBlock').language && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </button>
        {/* Language dropdown - positioned relative to the button */}
        {editor.isActive('codeBlock') && showLanguageDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[280px] max-h-[400px] overflow-y-auto">
            <div className="p-3 border-b border-border">
              <div className="text-sm font-medium text-foreground mb-2">Select Language</div>
              <input
                type="text"
                placeholder="Type to search languages..."
                value={languageSearch}
                onChange={(e) => setLanguageSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                autoFocus
              />
            </div>
            <div className="p-1">
              {[
                // Plain text option first
                { value: '', label: 'Plain Text' },
                // Most common languages
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'cpp', label: 'C++' },
                { value: 'csharp', label: 'C#' },
                { value: 'php', label: 'PHP' },
                { value: 'ruby', label: 'Ruby' },
                { value: 'go', label: 'Go' },
                { value: 'rust', label: 'Rust' },
                { value: 'sql', label: 'SQL' },
                { value: 'html', label: 'HTML' },
                { value: 'css', label: 'CSS' },
                { value: 'bash', label: 'Bash' },
                { value: 'powershell', label: 'PowerShell' },
                { value: 'json', label: 'JSON' },
                { value: 'xml', label: 'XML' },
                { value: 'yaml', label: 'YAML' },
                { value: 'markdown', label: 'Markdown' },
                { value: 'dockerfile', label: 'Dockerfile' },
                { value: 'shell', label: 'Shell' },
                { value: 'perl', label: 'Perl' },
                { value: 'scala', label: 'Scala' },
                { value: 'kotlin', label: 'Kotlin' },
                { value: 'swift', label: 'Swift' },
                { value: 'r', label: 'R' },
                { value: 'matlab', label: 'MATLAB' },
                { value: 'lua', label: 'Lua' },
                { value: 'haskell', label: 'Haskell' },
                { value: 'elixir', label: 'Elixir' },
                { value: 'clojure', label: 'Clojure' },
                { value: 'erlang', label: 'Erlang' },
                { value: 'fsharp', label: 'F#' },
                { value: 'dart', label: 'Dart' },
                { value: 'nim', label: 'Nim' },
                { value: 'crystal', label: 'Crystal' },
                { value: 'zig', label: 'Zig' },
                { value: 'v', label: 'V' },
                { value: 'odin', label: 'Odin' }
              ]
                .filter(lang => 
                  lang.label.toLowerCase().includes(languageSearch.toLowerCase()) ||
                  lang.value.toLowerCase().includes(languageSearch.toLowerCase())
                )
                .map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      editor.chain().focus().setCodeBlock({ language: lang.value }).run();
                      setLanguageSearch('');
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
                      editor.getAttributes('codeBlock').language === lang.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lang.label}</span>
                      {editor.getAttributes('codeBlock').language === lang.value && (
                        <Check size={14} className="text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="toolbar-separator" />

      {/* Links and media */}
      <div className="relative">
        <button
          onClick={setLink}
          className={`toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        
        {/* Link Input Modal */}
        {showLinkInput && (
          <div className="link-modal absolute top-full left-0 mt-2 bg-background border border-border rounded-md p-4 shadow-lg z-20 min-w-[350px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Add Link</h4>
              <button
                onClick={cancelLink}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">URL</label>
                <input
                  ref={linkInputRef}
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLink();
                    } else if (e.key === 'Escape') {
                      cancelLink();
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Link Text (optional)</label>
                <input
                  type="text"
                  placeholder="Custom link text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLink();
                    } else if (e.key === 'Escape') {
                      cancelLink();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to link selected text, or enter custom text for a new link
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={addLink}
                disabled={!linkUrl}
                className="flex items-center gap-1 px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={14} />
                Add Link
              </button>
              <button
                onClick={cancelLink}
                className="px-3 py-2 text-xs border border-border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Remove Link Button (when link is active) */}
      {editor.isActive('link') && (
        <button
          onClick={removeLink}
          className="toolbar-button text-destructive hover:bg-destructive hover:text-destructive-foreground"
          title="Remove Link"
        >
          <X size={16} />
        </button>
      )}
      
      {/* Image Upload */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="toolbar-button"
          title="Upload Image"
        >
          <Upload size={16} />
        </button>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-md p-4 shadow-lg z-20 min-w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Upload Image</h4>
            <button
              onClick={cancelImageUpload}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
          {imagePreview && (
            <div className="mb-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full h-32 object-contain rounded border"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={insertImage}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              <Check size={14} />
              Insert
            </button>
            <button
              onClick={cancelImageUpload}
              className="px-3 py-1 text-xs border border-border rounded hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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

// Code Block Language Display Component
const CodeBlockLanguageDisplay = ({ editor, onLanguageClick }: { editor: any; onLanguageClick?: () => void }) => {
  const [currentLanguage, setCurrentLanguage] = useState('');

  useEffect(() => {
    if (editor) {
      const updateLanguage = () => {
        const { language } = editor.getAttributes('codeBlock');
        setCurrentLanguage(language || '');
      };

      editor.on('selectionUpdate', updateLanguage);
      editor.on('focus', updateLanguage);
      
      return () => {
        editor.off('selectionUpdate', updateLanguage);
        editor.off('focus', updateLanguage);
      };
    }
  }, [editor]);

  if (!editor || !editor.isActive('codeBlock')) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={onLanguageClick}
        className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-sm hover:bg-background transition-colors group"
      >
        <span className="text-xs text-muted-foreground">Language:</span>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          {currentLanguage || 'Plain Text'}
        </span>
        <ChevronDown size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
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
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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
          class: 'max-w-full h-auto rounded-md border border-border',
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
        HTMLAttributes: {
          class: 'bg-muted border border-border rounded-md overflow-hidden text-foreground',
        },
        defaultLanguage: 'plaintext',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
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
      <MenuBar 
        editor={editor} 
        showLanguageDropdown={showLanguageDropdown}
        setShowLanguageDropdown={setShowLanguageDropdown}
      />
      <div className="relative">
        <EditorContent editor={editor} />
        <CodeBlockLanguageDisplay 
          editor={editor} 
          onLanguageClick={() => setShowLanguageDropdown(true)}
        />
      </div>
    </div>
  );
} 