import { cn } from '@/lib/cn'

export type Status = 'success' | 'failed' | 'running'

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  success: { label: 'Success', className: 'text-emerald-400 bg-emerald-500/10' },
  failed: { label: 'Failed', className: 'text-red-400 bg-red-500/10' },
  running: { label: 'Running', className: 'text-accent bg-accent/10' },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {status === 'running' && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
      {config.label}
    </span>
  )
}
