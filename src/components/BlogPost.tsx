'use client';

import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime?: number;
  tags?: string[];
  className?: string;
}

export default function BlogPost({
  title,
  content,
  author,
  publishedAt,
  readTime = 5,
  tags = [],
  className = ''
}: BlogPostProps) {
  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
          {title}
        </h1>
        
        <div className="flex items-center gap-6 text-muted-foreground text-sm mb-6">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{format(publishedAt, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{readTime} min read</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-a:text-primary prose-li:text-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
} 