import { Clock, Coins, Hash, Layers } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatCost, formatDuration, formatTokenCount } from '../utils'
import type { Trace } from '../types'

interface TraceSummaryProps {
  trace: Trace
}

export function TraceSummary({ trace }: TraceSummaryProps) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total duration" value={formatDuration(trace.durationMs)} icon={Clock} />
      <StatCard label="Total spans" value={String(trace.spanCount)} icon={Layers} />
      <StatCard label="Token usage" value={formatTokenCount(trace.totalTokens)} icon={Hash} />
      <StatCard label="Estimated cost" value={formatCost(trace.estimatedCost)} icon={Coins} />
    </section>
  )
}
