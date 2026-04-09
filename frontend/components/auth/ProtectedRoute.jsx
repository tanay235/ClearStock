'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Leaf } from 'lucide-react';

/**
 * ProtectedRoute Wrapper
 * Ensures users are logged in and have the correct role.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not logged in, whisk them back to login
    if (!loading && !isLoggedIn) {
      router.replace('/login');
      return;
    }

    // Role-based protection: If logged in but role is unauthorized
    if (!loading && isLoggedIn && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user?.role)) {
        // Redirect to their own correct dashboard
        if (user.role === 'buyer' || user.role === 'customer') {
          router.replace('/dashboard/buyer');
        } else if (user.role === 'seller') {
          router.replace('/dashboard/seller');
        } else {
          router.replace('/');
        }
      }
    }
  }, [user, loading, isLoggedIn, allowedRoles, router]);

  // Loading State: Premium experience
  if (loading || (!isLoggedIn && !user)) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Leaf className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-dark tracking-tight">Verifying Credentials...</h2>
        <p className="text-muted mt-2 font-medium">Securing your ClearStock session.</p>
      </div>
    );
  }

  // If role doesn't match, we still render nothing until the useEffect redirect hits
  if (isLoggedIn && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return <>{children}</>;
}
