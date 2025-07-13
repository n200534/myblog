'use client';

import { useAuth } from '../auth/AuthContext';
import { PenTool, User, LogOut, Settings, BookOpen, Plus, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <PenTool className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-xl md:text-2xl font-bold text-foreground">Security Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <Link 
                href="/blog" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                All Blogs
              </Link>
            )}
            {user && (
              <>
                <Link 
                  href="/post" 
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Write Blog
                </Link>
                <Link 
                  href="/my-blogs" 
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  My Blogs
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {user.displayName}
                  </span>
                  <User className="h-4 w-4 text-muted-foreground" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href="/my-blogs"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen className="h-4 w-4" />
                      My Blogs
                    </Link>
                    <Link
                      href="/post"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Write Blog
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              {user && (
                <div className="px-3 py-3 border-b border-border mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
              {user && (
                <Link 
                  href="/blog" 
                  className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-accent transition-colors font-medium rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4" />
                  All Blogs
                </Link>
              )}
              {user && (
                <>
                  <Link 
                    href="/post" 
                    className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-accent transition-colors font-medium rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    Write Blog
                  </Link>
                  <Link 
                    href="/my-blogs" 
                    className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-accent transition-colors font-medium rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    My Blogs
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-accent transition-colors font-medium rounded-md w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
              {!user && (
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-border">
                  <Link
                    href="/signin"
                    className="px-3 py-2 text-foreground hover:text-primary transition-colors font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 