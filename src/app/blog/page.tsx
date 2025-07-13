'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/ui/Navigation';
import { Search, Calendar, User, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import { getAllPosts, searchPosts, getPostsByTag, BlogPost } from '@/lib/posts';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const filterPosts = async () => {
      try {
        let filtered = posts;

        // Filter by search term
        if (searchTerm) {
          filtered = await searchPosts(searchTerm);
        }

        // Filter by tag
        if (selectedTag) {
          filtered = await getPostsByTag(selectedTag);
        }

        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Failed to filter posts:', error);
      }
    };

    filterPosts();
  }, [posts, searchTerm, selectedTag]);

  const getAllTags = () => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blogs...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">All Blogs</h1>
            <p className="text-muted-foreground">
              Discover insights from security professionals around the world
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Tags Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === ''
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              {getAllTags().map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedTag 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to share your security insights!'
                }
              </p>
              {!searchTerm && !selectedTag && (
                <Link
                  href="/post"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Write Your First Blog
                </Link>
              )}
            </div>
          ) : (
            // Posts Grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>

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
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} blogs
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 