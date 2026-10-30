import { redirect } from '@tanstack/react-router'
import { getAuthToken } from '#/lib/session'

// --- Mock auth state ---
// In production, replace with real token/session validation
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

// --- Route guard helper ---
// Use in beforeLoad to protect routes
export function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}

// Redirect logged-in users away from auth pages
export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    throw redirect({ to: '/examples' })
  }
}
