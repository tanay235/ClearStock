import { request } from '../lib/api';

/**
 * Register a new user (Customer or Seller)
 */
export async function register(userData) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

/**
 * Log in an existing user
 */
export async function login(credentials) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

/**
 * Get current user profile (JWT protected)
 */
export async function getMe() {
  return await request('/api/auth/me');
}

/**
 * Log out and clear local storage
 */
export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
