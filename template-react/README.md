# React Starter

A modern React application starter.

## Stack

- React 19
- Vite 8
- TypeScript
- TanStack Router
- Tailwind CSS
- oxlint
- oxfmt

## HTTP client

`src/lib/http.ts` provides a shared Ky instance and typed JSON helpers. The helpers
return `Promise<T | undefined>`: an empty successful response (including HTTP 204)
returns `undefined`, while a JSON `null` remains `null`. Invalid non-empty JSON
throws its original parsing error. A custom `parseJson` option overrides the
default parser and is responsible for its own empty-body handling.
Ky 2.1 or newer is required so the custom parser receives empty response bodies.

Only GET requests are retried by default, at most once for transient network
failures or HTTP 408, 502, 503, and 504. Final HTTP failures become `ApiError` with
`status`, `body`, and the original Ky error in `cause`. `NetworkError` and
`TimeoutError` are re-exported from Ky; abort reasons and application errors pass
through unchanged. Callers should distinguish cancellation from a failed request.
