'use client';

import { useAuth } from '@/components/auth/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import Navigation from '@/components/ui/Navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </div>
    </div>
  );
} 