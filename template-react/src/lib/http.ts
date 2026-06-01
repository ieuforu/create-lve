const BASE_URL = import.meta.env.VITE_API_BASE_URL

// ── 类型 ──

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>
  data?: unknown
  timeout?: number
}

type RequestInterceptor = (
  config: RequestInit & { url: string },
) => (RequestInit & { url: string }) | Promise<RequestInit & { url: string }>

type ResponseInterceptor = (response: Response) => Response | Promise<Response>

interface HttpError extends Error {
  status: number
  data: unknown
}

// ── 拦截器管理 ──

const interceptors = {
  request: [] as RequestInterceptor[],
  response: [] as ResponseInterceptor[],
}

// ── 工具函数 ──

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const isSameOrigin = !BASE_URL || BASE_URL === window.location.origin
  const base = isSameOrigin ? '' : BASE_URL
  const url = new URL(path, base || window.location.origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, String(value))
    })
  }
  return isSameOrigin ? `${url.pathname}${url.search}` : url.toString()
}

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) return res.json() as Promise<T>
  return res.text() as unknown as Promise<T>
}

function createHttpError(res: Response, data: unknown): HttpError {
  const err = new Error(`HTTP ${res.status}`) as HttpError
  err.status = res.status
  err.data = data
  return err
}

// ── 核心请求 ──

async function request<T = unknown>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, data, timeout = 15000, signal, ...rest } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  let config: RequestInit & { url: string } = {
    url: buildUrl(path, params),
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
    signal: controller.signal,
    ...rest,
  }

  for (const interceptor of interceptors.request) {
    config = await interceptor(config)
  }

  try {
    const { url, ...fetchConfig } = config
    let res = await fetch(url, fetchConfig)

    for (const interceptor of interceptors.response) {
      res = await interceptor(res)
    }

    if (!res.ok) {
      const errorData = await parseResponse<unknown>(res).catch(() => null)
      throw createHttpError(res, errorData)
    }

    return await parseResponse<T>(res)
  } finally {
    clearTimeout(timeoutId)
  }
}

// ── 导出 ──

export const http = {
  request,

  get<T = unknown>(path: string, options?: RequestOptions) {
    return request<T>('GET', path, options)
  },

  post<T = unknown>(path: string, data?: unknown, options?: RequestOptions) {
    return request<T>('POST', path, { ...options, data })
  },

  put<T = unknown>(path: string, data?: unknown, options?: RequestOptions) {
    return request<T>('PUT', path, { ...options, data })
  },

  patch<T = unknown>(path: string, data?: unknown, options?: RequestOptions) {
    return request<T>('PATCH', path, { ...options, data })
  },

  delete<T = unknown>(path: string, options?: RequestOptions) {
    return request<T>('DELETE', path, options)
  },

  interceptors: {
    request: {
      use(interceptor: RequestInterceptor) {
        interceptors.request.push(interceptor)
      },
    },
    response: {
      use(onFulfilled: ResponseInterceptor) {
        interceptors.response.push(onFulfilled)
      },
    },
  },
}
