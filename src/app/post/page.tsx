'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Navigation from '@/components/ui/Navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { useRouter } from 'next/navigation';
import { Save, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
}

export default function PostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    // Load existing posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, [user, router]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: title.trim(),
        content,
        author: user?.name || 'Anonymous',
        publishedAt: new Date(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

      // Reset form
      setTitle('');
      setContent('');
      setTags('');
      setIsPreview(false);

      alert('Blog post saved successfully!');
    } catch (error) {
      alert('Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  isPreview 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                <Eye size={16} />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim() || !content.trim()}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${
                  isSaving || !title.trim() || !content.trim()
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Post
                  </>
                )}
              </button>
            </div>
          </div>

          {isPreview ? (
            // Preview Mode
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{title || 'Untitled Post'}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>By {user.name}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                  {tags && (
                    <>
                      <span>•</span>
                      <span>{tags}</span>
                    </>
                  )}
                </div>
              </div>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-a:text-primary prose-li:text-foreground"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            // Editor Mode
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Post Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title..."
                  className="w-full px-4 py-3 text-lg font-medium border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium text-foreground">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="security, cybersecurity, hacking, etc."
                  className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Content
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your security insights..."
                  className="min-h-[500px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 