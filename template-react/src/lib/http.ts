import { getAuthToken } from '#/lib/auth.ts'
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
        // const token = localStorage.getItem('auth_token')
        const token = getAuthToken()
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

async function request<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }

    throw new NetworkError()
  }
}

// --- Typed helpers ---

export function apiGet<T>(url: string, opts?: Options) {
  return request(() => http.get(url, opts).json<T>())
}

export function apiPost<T>(url: string, opts?: Options) {
  return request(() => http.post(url, opts).json<T>())
}

export function apiPut<T>(url: string, opts?: Options) {
  return request(() => http.put(url, opts).json<T>())
}

export function apiDelete<T>(url: string, opts?: Options) {
  return request(async () => {
    const response = await http.delete(url, opts)

    if (response.status === 204) {
      return undefined
    }

    return response.json<T>()
  })
}
