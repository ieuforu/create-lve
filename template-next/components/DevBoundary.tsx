import { RscServerBoundaryMarker } from 'rsc-boundary'

interface DevBoundaryProps {
  children: React.ReactNode
  label: string
}

export function DevBoundary({ children, label }: DevBoundaryProps) {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return <RscServerBoundaryMarker label={label}>{children}</RscServerBoundaryMarker>
}
