import { AlertTriangle, ArrowLeft, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ERoutes } from '@/constants/routes'
import { SpanDetailsPanel } from '../components/SpanDetailsPanel'
import { SpanTree } from '../components/SpanTree'
import { SpanWaterfall } from '../components/SpanWaterfall'
import { TraceSummary } from '../components/TraceSummary'
import { mockTraces } from '../mockData'
import { formatAbsoluteTime, formatDuration } from '../utils'

export function TraceDetailsPage() {
  const { traceId } = useParams<{ traceId: string }>()
  const trace = mockTraces.find((item) => item.id === traceId)
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(trace?.spans[0]?.id ?? null)
  const [copied, setCopied] = useState(false)

  if (!trace) {
    return (
      <div className="flex h-full flex-col gap-4">
        <BackLink />
        <EmptyState
          icon={AlertTriangle}
          title="Trace not found"
          description="This trace may have expired, or the link is incorrect."
        />
      </div>
    )
  }

  const selectedSpan = trace.spans.find((span) => span.id === selectedSpanId) ?? null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trace.id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access may be unavailable; fail silently
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <BackLink />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-sm text-neutral-300">{trace.id}</h1>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy trace ID"
            className="rounded p-1 text-neutral-500 hover:text-neutral-200"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <StatusBadge status={trace.status} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <span className="font-medium text-neutral-200">{trace.agentName}</span>
          <span className="text-neutral-600">&middot;</span>
          <span>{formatAbsoluteTime(trace.startedAt)}</span>
          <span className="text-neutral-600">&middot;</span>
          <span>{formatDuration(trace.durationMs)}</span>
        </div>
      </div>

      <TraceSummary trace={trace} />

      <SpanWaterfall
        spans={trace.spans}
        totalDurationMs={trace.durationMs}
        selectedSpanId={selectedSpanId}
        onSelectSpan={setSelectedSpanId}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SpanTree spans={trace.spans} selectedSpanId={selectedSpanId} onSelectSpan={setSelectedSpanId} />
        <SpanDetailsPanel span={selectedSpan} />
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link to={ERoutes.TRACES} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-200">
      <ArrowLeft className="h-3.5 w-3.5" />
      Traces
    </Link>
  )
}
