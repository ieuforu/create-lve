// Mock session storage. Replace this adapter with your application's session handling.
export function getAuthToken(): string | null {
  return window.localStorage.getItem('auth_token')
}

export function setAuthToken(token: string) {
  window.localStorage.setItem('auth_token', token)
}

export function clearAuthToken() {
  window.localStorage.removeItem('auth_token')
}
