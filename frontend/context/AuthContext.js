'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, register as registerService, getMe, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe();
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to load user:', error.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginService(credentials);
      if (res.success) {
        setUser(res.user);
        
        // Role-based redirection
        const role = res.user.role;
        if (role === 'buyer' || role === 'customer') {
          router.push('/dashboard/buyer');
        } else if (role === 'seller') {
          router.push('/dashboard/seller');
        }
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerService(userData);
      if (res.success) {
        setUser(res.user);
        
        // Role-based redirection
        const role = res.user.role;
        if (role === 'buyer' || role === 'customer') {
          router.push('/dashboard/buyer');
        } else if (role === 'seller') {
          router.push('/dashboard/seller');
        }
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    logoutService();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
