import { AlertTriangle, Check, Copy, Search as SearchIcon } from 'lucide-react'
import { useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Trace } from '../types'
import { formatDuration, formatRelativeTime, shortenTraceId } from '../utils'

const SKELETON_ROWS = 6

interface TracesTableProps {
  traces: Trace[]
  isLoading: boolean
  error: string | null
  onRowClick: (traceId: string) => void
  onRetry?: () => void
}

export function TracesTable({ traces, isLoading, error, onRowClick, onRetry }: TracesTableProps) {
  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <AlertTriangle className="h-6 w-6 text-red-400" />
        <p className="text-sm font-medium text-neutral-100">Couldn't load traces</p>
        <p className="max-w-sm text-sm text-neutral-500">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Try again
          </button>
        )}
      </Card>
    )
  }

  if (!isLoading && traces.length === 0) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="No traces match your filters"
        description="Try adjusting the search, status, or time range filters."
      />
    )
  }

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-2.5 font-medium">Trace ID</th>
              <th className="px-5 py-2.5 font-medium">Agent</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium text-right">Duration</th>
              <th className="hidden px-5 py-2.5 font-medium text-right md:table-cell">Spans</th>
              <th className="px-5 py-2.5 font-medium text-right">Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, index) => <SkeletonRow key={index} />)
              : traces.map((trace) => (
                  <TraceRow key={trace.id} trace={trace} onClick={() => onRowClick(trace.id)} />
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

interface TraceRowProps {
  trace: Trace
  onClick: () => void
}

function TraceRow({ trace, onClick }: TraceRowProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (event: MouseEvent) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(trace.id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access may be unavailable; fail silently
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer text-neutral-300 outline-none hover:bg-neutral-800/40 focus-visible:bg-neutral-800/40 focus-visible:ring-1 focus-visible:ring-accent"
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-1.5" title={trace.id}>
          <span className="font-mono text-xs text-neutral-400">{shortenTraceId(trace.id)}</span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy trace ID"
            className="rounded p-0.5 text-neutral-500 opacity-0 transition-opacity hover:text-neutral-200 group-hover:opacity-100 focus-visible:opacity-100"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </td>
      <td className="px-5 py-3">{trace.agentName}</td>
      <td className="px-5 py-3">
        <StatusBadge status={trace.status} />
      </td>
      <td className="px-5 py-3 text-right text-neutral-400 tabular-nums">{formatDuration(trace.durationMs)}</td>
      <td className="hidden px-5 py-3 text-right text-neutral-500 tabular-nums md:table-cell">{trace.spanCount}</td>
      <td className="px-5 py-3 text-right text-neutral-500">{formatRelativeTime(trace.startedAt)}</td>
    </tr>
  )
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-5 py-3">
        <div className="h-3.5 w-28 animate-pulse rounded bg-neutral-800" />
      </td>
      <td className="px-5 py-3">
        <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-800" />
      </td>
      <td className="px-5 py-3">
        <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-800" />
      </td>
      <td className="px-5 py-3 text-right">
        <div className="ml-auto h-3.5 w-12 animate-pulse rounded bg-neutral-800" />
      </td>
      <td className="hidden px-5 py-3 text-right md:table-cell">
        <div className="ml-auto h-3.5 w-8 animate-pulse rounded bg-neutral-800" />
      </td>
      <td className="px-5 py-3 text-right">
        <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-neutral-800" />
      </td>
    </tr>
  )
}
