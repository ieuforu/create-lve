import type { ParentProps } from 'solid-js'
import { HydrationScript } from '@solidjs/web'

export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.svg" />
        <title>__APP_NAME__</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  )
}
