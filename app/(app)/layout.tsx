'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      {/* Desktop: offset sidebar. Mobile: offset top bar + bottom nav */}
      <main className="md:ml-60 w-full pt-16 md:pt-0 pb-24 md:pb-8">
        <div className="px-4 md:px-8 py-4 md:py-8 w-full max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
