'use client';

import { useAuth } from '@/components/auth/AuthContext';
import Navigation from '@/components/ui/Navigation';
import { PenTool, Shield, Users, BookOpen, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <PenTool className="h-8 w-8 text-primary" />
              <span className="text-lg font-semibold text-primary">Security Blog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Share Your Security
              <span className="text-primary block">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join a community of security professionals, researchers, and enthusiasts. 
              Share your knowledge, discover new insights, and contribute to the security ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/post"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Write Your First Blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground rounded-md font-medium hover:bg-accent transition-colors"
                  >
                    Explore Blogs
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Security Blog?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A platform designed specifically for security professionals to share knowledge and insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Rich Editor</h3>
              <p className="text-muted-foreground">
                Write with our Medium-style editor featuring code highlighting, images, and beautiful typography
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Security Focused</h3>
              <p className="text-muted-foreground">
                Built for security professionals with features tailored to technical content and code sharing
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow security experts, researchers, and enthusiasts from around the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Blog Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Authors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Active Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Knowledge?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our community of security professionals and start sharing your insights today.
          </p>
          {user ? (
            <Link
              href="/post"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-md font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Write Your Blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-md font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <PenTool className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Security Blog</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground transition-colors">
                All Blogs
              </Link>
              <Link href="/signin" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Security Blog. Built for the security community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
