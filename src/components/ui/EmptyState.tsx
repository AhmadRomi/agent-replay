import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 px-6 py-16 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/60 text-neutral-400">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h2 className="text-sm font-medium text-neutral-100">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>
    </div>
  )
}
