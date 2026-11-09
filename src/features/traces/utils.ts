import type { Span, Trace, TraceStatus } from './types'

export type TimeRange = '1h' | '24h' | '7d'

export const TIME_RANGE_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
]

const TIME_RANGE_MS: Record<TimeRange, number> = {
  '1h': 60 * 60_000,
  '24h': 24 * 60 * 60_000,
  '7d': 7 * 24 * 60 * 60_000,
}

export function filterByTimeRange(traces: Trace[], range: TimeRange): Trace[] {
  const threshold = Date.now() - TIME_RANGE_MS[range]
  return traces.filter((trace) => new Date(trace.startedAt).getTime() >= threshold)
}

export type StatusFilter = 'all' | TraceStatus
export type SortOption = 'newest' | 'oldest' | 'longest' | 'shortest'

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'longest', label: 'Longest duration' },
  { value: 'shortest', label: 'Shortest duration' },
]

export interface TraceQuery {
  search: string
  status: StatusFilter
  sortBy: SortOption
}

export function filterAndSortTraces(traces: Trace[], query: TraceQuery): Trace[] {
  const term = query.search.trim().toLowerCase()

  const filtered = traces.filter((trace) => {
    if (query.status !== 'all' && trace.status !== query.status) return false
    if (!term) return true
    return trace.id.toLowerCase().includes(term) || trace.agentName.toLowerCase().includes(term)
  })

  return [...filtered].sort((a, b) => {
    switch (query.sortBy) {
      case 'oldest':
        return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
      case 'longest':
        return b.durationMs - a.durationMs
      case 'shortest':
        return a.durationMs - b.durationMs
      case 'newest':
      default:
        return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    }
  })
}

export interface TraceMetricsSummary {
  totalTraces: number
  successRate: number
  avgDurationMs: number
  failedTraces: number
}

export function computeTraceMetrics(traces: Trace[]): TraceMetricsSummary {
  const totalTraces = traces.length
  const failedTraces = traces.filter((trace) => trace.status === 'failed').length
  const successTraces = traces.filter((trace) => trace.status === 'success').length
  const successRate = totalTraces === 0 ? 0 : (successTraces / totalTraces) * 100
  const avgDurationMs =
    totalTraces === 0 ? 0 : traces.reduce((sum, trace) => sum + trace.durationMs, 0) / totalTraces

  return { totalTraces, successRate, avgDurationMs, failedTraces }
}

export function shortenTraceId(id: string, visibleChars = 14): string {
  return id.length <= visibleChars ? id : `${id.slice(0, visibleChars)}…`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  const totalSeconds = ms / 1000
  if (totalSeconds < 60) return `${totalSeconds.toFixed(totalSeconds < 10 ? 1 : 0)}s`
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.round(totalSeconds % 60)
  return `${minutes}m ${seconds}s`
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'just now'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
  return `${Math.floor(diffMs / day)}d ago`
}

export function formatAbsoluteTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return String(tokens)
  return `${(tokens / 1000).toFixed(1)}k`
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`
}

export interface SpanTreeNode extends Span {
  children: SpanTreeNode[]
}

export function buildSpanTree(spans: Span[]): SpanTreeNode[] {
  const nodeMap = new Map<string, SpanTreeNode>()
  spans.forEach((span) => nodeMap.set(span.id, { ...span, children: [] }))

  const roots: SpanTreeNode[] = []
  nodeMap.forEach((node) => {
    const parent = node.parentId ? nodeMap.get(node.parentId) : undefined
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export interface FlattenedSpan extends SpanTreeNode {
  depth: number
}

export function flattenSpanTree(nodes: SpanTreeNode[], depth = 0): FlattenedSpan[] {
  const sorted = [...nodes].sort((a, b) => a.startOffsetMs - b.startOffsetMs)
  const result: FlattenedSpan[] = []
  sorted.forEach((node) => {
    result.push({ ...node, depth })
    result.push(...flattenSpanTree(node.children, depth + 1))
  })
  return result
}
