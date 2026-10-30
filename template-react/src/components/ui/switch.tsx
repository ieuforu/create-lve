import type { ComponentProps } from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '#/lib/utils'

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={(state) =>
        cn(
          'inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-foreground/20 p-0.5 outline-none transition-colors data-[checked]:bg-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 rounded-full bg-background shadow-sm transition-transform data-[checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  )
}
