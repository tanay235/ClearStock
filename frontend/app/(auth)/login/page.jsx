'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, user, isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'buyer' || user.role === 'customer') {
        router.replace('/dashboard/buyer');
      } else if (user.role === 'seller') {
        router.replace('/dashboard/seller');
      }
    }
  }, [isLoggedIn, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    }
  };
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col lg:flex-row overflow-hidden w-full max-w-5xl lg:h-[650px]">
      
      {/* Left side: Image showcase */}
      <div className="hidden lg:block lg:w-1/2 relative bg-dark">
        <img 
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80" 
          alt="Pallets in warehouse" 
          className="w-full h-full object-cover opacity-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-dark/90 to-primary/20 mix-blend-multiply" />
        
        {/* Brand Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-12 mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              Clear<span className="text-primary">Stock</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Welcome back to the network.
          </h2>
          <p className="text-white/70">
            Log in to manage your inventory and browse wholesale deals.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
        <Link href="/" className="inline-flex lg:hidden items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-dark mb-2">Sign In</h1>
          <p className="text-muted">Enter your details to access your dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Work Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-dark">Password</label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-gray-300 pointer-events-auto cursor-pointer" />
            <label htmlFor="remember" className="text-sm text-dark cursor-pointer select-none">Remember for 30 days</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg justify-center shadow-lg shadow-primary/30 mt-6 disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors">
            Sign up now
          </Link>
        </p>
      </div>

    </div>
  );
}
