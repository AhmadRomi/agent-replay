import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from './Card'

interface StatCardTrend {
  value: string
  direction: 'up' | 'down'
}

interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  trend?: StatCardTrend
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-600" strokeWidth={2} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-neutral-50">{value}</span>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400',
            )}
          >
            {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  )
}
