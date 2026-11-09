import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatDuration } from '../utils'
import type { TraceMetricsSummary } from '../utils'

interface TraceMetricsProps {
  metrics: TraceMetricsSummary
}

export function TraceMetrics({ metrics }: TraceMetricsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total traces" value={metrics.totalTraces.toLocaleString()} icon={Activity} />
      <StatCard label="Success rate" value={`${metrics.successRate.toFixed(1)}%`} icon={CheckCircle2} />
      <StatCard label="Avg. duration" value={formatDuration(metrics.avgDurationMs)} icon={Clock} />
      <StatCard label="Failed traces" value={metrics.failedTraces.toLocaleString()} icon={AlertTriangle} />
    </section>
  )
}
