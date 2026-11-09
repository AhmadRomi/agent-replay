import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDuration } from '../utils'
import type { Span } from '../types'

interface SpanDetailsPanelProps {
  span: Span | null
}

export function SpanDetailsPanel({ span }: SpanDetailsPanelProps) {
  if (!span) {
    return (
      <Card className="flex items-center justify-center py-16 text-center text-sm text-neutral-500">
        Select a span to view its details.
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-sm font-medium text-neutral-100">{span.name}</h2>
          <StatusBadge status={span.status} />
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          {span.type} &middot; starts at {formatDuration(span.startOffsetMs)} &middot; runs for{' '}
          {formatDuration(span.durationMs)}
        </p>
      </div>

      {span.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{span.error}</span>
        </div>
      )}

      {span.input && <DetailBlock label="Input" value={span.input} />}
      {span.output && <DetailBlock label="Output" value={span.output} />}

      {span.metadata && Object.keys(span.metadata).length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">Metadata</p>
          <dl className="space-y-1 text-xs">
            {Object.entries(span.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <dt className="text-neutral-500">{key}</dt>
                <dd className="font-mono text-neutral-300">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Card>
  )
}

interface DetailBlockProps {
  label: string
  value: string
}

function DetailBlock({ label, value }: DetailBlockProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs text-neutral-300">
        {value}
      </pre>
    </div>
  )
}
