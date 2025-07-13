"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPost, BlogPost } from "@/lib/posts";
import Navigation from "@/components/ui/Navigation";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, Clock, Eye, Share2, BookOpen, Bookmark, BookmarkPlus, ChevronUp, ChevronDown } from "lucide-react";
import BlogContent from "@/components/BlogContent";

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Handle reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle bookmark toggle
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would save to localStorage or database
    if (!isBookmarked) {
      alert('Added to bookmarks!');
    } else {
      alert('Removed from bookmarks!');
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPost(id as string)
      .then((data) => {
        if (data) setPost(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Loading blog post...
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Blog Not Found</h2>
          <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Share this post"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={toggleBookmark}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <Bookmark className="h-4 w-4 fill-current" /> : <BookmarkPlus className="h-4 w-4" />}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              title="Share this post"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
        {/* Mobile Metadata */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {calculateReadingTime(post.content)} min
              </span>
            </div>
            <button
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <BookOpen className="h-4 w-4" />
              {showTableOfContents ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{post.authorName}</span>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-muted text-xs rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Metadata */}
        <div className="hidden md:flex flex-wrap gap-4 text-muted-foreground text-sm mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.authorName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {calculateReadingTime(post.content)} min read
          </span>
          {post.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {post.tags.map((tag, i) => (
                <span key={i} className="ml-1 px-2 py-1 bg-muted text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Mobile Table of Contents */}
        {showTableOfContents && (
          <div className="md:hidden mb-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Table of Contents</h3>
            <div className="space-y-2 text-sm">
              <button className="block w-full text-left text-primary hover:underline">Introduction</button>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground">What is Social Engineering?</button>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground">Common Attack Types</button>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground">Defense Strategies</button>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground">Conclusion</button>
            </div>
          </div>
        )}

        <article className="mt-6 md:mt-8">
          <BlogContent content={post.content} />
        </article>

        {/* Mobile Bottom Actions */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              title="Back to top"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 