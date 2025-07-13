'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Navigation from '@/components/ui/Navigation';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, Plus, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { getPostsByAuthor, deletePost, BlogPost } from '@/lib/posts';

export default function MyBlogsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const loadPosts = async () => {
      try {
        const userPosts = await getPostsByAuthor(user.uid);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [user, router]);

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error: any) {
        alert('Failed to delete post: ' + error.message);
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    // For now, we'll just navigate to the post page
    // In a real app, you'd want to populate the editor with the post data
    router.push('/post');
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your blogs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Blogs</h1>
              <p className="text-muted-foreground">
                Manage and view your published blog posts
              </p>
            </div>
            <Link
              href="/post"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Write New Blog
            </Link>
          </div>

          {posts.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No blogs yet</h3>
              <p className="text-muted-foreground mb-6">
                Start writing your first blog post to share your security insights with the community.
              </p>
              <Link
                href="/post"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Write Your First Blog
              </Link>
            </div>
          ) : (
            // Posts Grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id!)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.authorName}</span>
                      </div>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          // In a real app, this would navigate to the full post view
                          alert('View full post functionality would be implemented here');
                        }}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Eye className="h-3 w-3" />
                        View Post
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 