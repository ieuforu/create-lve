/**
 * 统一请求客户端
 * - 自动拼接 baseUrl（开发环境走 vite proxy /api）
 * - 统一错误处理
 * - 类型安全
 */

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

interface RequestOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    signal: options?.signal,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let errBody: unknown
    try {
      errBody = await res.json()
    } catch {
      errBody = await res.text().catch(() => null)
    }
    throw new ApiError(`[${method}] ${url} → ${res.status}`, res.status, errBody)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>('GET', url, undefined, options),

  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', url, body, options),

  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', url, body, options),

  patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', url, body, options),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>('DELETE', url, undefined, options),
}
