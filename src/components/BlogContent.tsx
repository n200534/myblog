'use client';

interface BlogContentProps {
  content: string;
  className?: string;
}

export default function BlogContent({ content, className = '' }: BlogContentProps) {
  return (
    <div 
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 