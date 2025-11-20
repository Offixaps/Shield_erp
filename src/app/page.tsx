
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to a neutral selection page instead of a specific department
        router.replace('/select-department');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Render a loading state while checking auth
  return (
    <div className="flex h-screen items-center justify-center">
      <div>Loading...</div>
    </div>
  );
}
