import ky, { type KyInstance, type Options } from 'ky'

// --- Error types ---
export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

// --- Config ---
const API_PREFIX = import.meta.env.VITE_API_URL ?? '/api'

// --- Ky instance ---
export const http: KyInstance = ky.create({
  prefix: API_PREFIX,
  timeout: 15_000,
  retry: { limit: 1, methods: ['get'], statusCodes: [408, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      (state) => {
        const token = localStorage.getItem('auth_token')
        if (token) state.request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async (state) => {
        if (!state.response.ok) {
          let body: unknown
          try {
            body = await state.response.json()
          } catch {
            body = null
          }
          throw new ApiError(
            (body as { message?: string } | null)?.message ?? state.response.statusText,
            state.response.status,
            body,
          )
        }
      },
    ],
  },
})

// --- Typed helpers ---
export async function apiGet<T>(url: string, opts?: Options): Promise<T> {
  try {
    return await http.get(url, opts).json<T>()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new NetworkError()
  }
}

export async function apiPost<T>(url: string, opts?: Options): Promise<T> {
  try {
    return await http.post(url, opts).json<T>()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new NetworkError()
  }
}

export async function apiPut<T>(url: string, opts?: Options): Promise<T> {
  try {
    return await http.put(url, opts).json<T>()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new NetworkError()
  }
}

export async function apiDelete<T>(url: string, opts?: Options): Promise<T> {
  try {
    return await http.delete(url, opts).json<T>()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new NetworkError()
  }
}
