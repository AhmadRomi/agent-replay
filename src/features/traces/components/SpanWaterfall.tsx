import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { buildSpanTree, flattenSpanTree, formatDuration } from '../utils'
import type { Span } from '../types'

const STATUS_BAR_CLASS: Record<Span['status'], string> = {
  success: 'bg-emerald-500/70',
  failed: 'bg-red-500/80',
  running: 'bg-accent/70 animate-pulse',
}

const TIME_MARKS = [0, 0.25, 0.5, 0.75, 1]

interface SpanWaterfallProps {
  spans: Span[]
  totalDurationMs: number
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
}

export function SpanWaterfall({ spans, totalDurationMs, selectedSpanId, onSelectSpan }: SpanWaterfallProps) {
  const flattened = flattenSpanTree(buildSpanTree(spans))
  const safeTotal = Math.max(totalDurationMs, 1)

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <h2 className="text-sm font-medium text-neutral-100">Span timeline</h2>
        <span className="text-xs text-neutral-500">{formatDuration(totalDurationMs)} total</span>
      </div>

      <div className="overflow-x-auto px-5 py-4">
        <div className="min-w-[640px]">
          <div className="mb-2 flex pl-48 text-xs text-neutral-500">
            {TIME_MARKS.map((mark) => (
              <span key={mark} className="flex-1 text-left">
                {formatDuration(safeTotal * mark)}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {flattened.map((span) => (
              <button
                key={span.id}
                type="button"
                onClick={() => onSelectSpan(span.id)}
                className={cn(
                  'flex items-center gap-3 rounded-md py-1 text-left transition-colors hover:bg-neutral-800/40',
                  selectedSpanId === span.id && 'bg-neutral-800/60',
                )}
              >
                <span
                  className="w-48 shrink-0 truncate text-xs text-neutral-300"
                  style={{ paddingLeft: span.depth * 14 }}
                  title={span.name}
                >
                  {span.name}
                </span>
                <span className="relative h-5 flex-1 rounded bg-neutral-900/60">
                  <span
                    className={cn('absolute inset-y-0.5 rounded-sm', STATUS_BAR_CLASS[span.status])}
                    style={{
                      left: `${(span.startOffsetMs / safeTotal) * 100}%`,
                      width: `${Math.max((span.durationMs / safeTotal) * 100, 0.6)}%`,
                    }}
                  />
                </span>
                <span className="w-16 shrink-0 text-right text-xs tabular-nums text-neutral-500">
                  {formatDuration(span.durationMs)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
