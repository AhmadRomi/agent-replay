import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { OverviewStat } from '../mockData'

export function OverviewStatCard({ label, value, change, trend }: OverviewStat) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-neutral-50">{value}</span>
        <span
          className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            trend === 'up' ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}
        </span>
      </div>
    </Card>
  )
}
