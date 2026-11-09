import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { buildSpanTree } from '../utils'
import type { Span } from '../types'
import type { SpanTreeNode } from '../utils'

const STATUS_DOT_CLASS: Record<Span['status'], string> = {
  success: 'bg-emerald-500',
  failed: 'bg-red-500',
  running: 'bg-accent',
}

interface SpanTreeProps {
  spans: Span[]
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
}

export function SpanTree({ spans, selectedSpanId, onSelectSpan }: SpanTreeProps) {
  const tree = useMemo(() => buildSpanTree(spans), [spans])
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggleCollapsed = (spanId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(spanId)) {
        next.delete(spanId)
      } else {
        next.add(spanId)
      }
      return next
    })
  }

  return (
    <Card className="p-0">
      <div className="border-b border-neutral-800 px-5 py-4">
        <h2 className="text-sm font-medium text-neutral-100">Spans</h2>
      </div>
      <div className="max-h-[480px] overflow-y-auto p-2">
        {tree.map((node) => (
          <SpanTreeRow
            key={node.id}
            node={node}
            depth={0}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            selectedSpanId={selectedSpanId}
            onSelectSpan={onSelectSpan}
          />
        ))}
      </div>
    </Card>
  )
}

interface SpanTreeRowProps {
  node: SpanTreeNode
  depth: number
  collapsed: Set<string>
  onToggleCollapsed: (spanId: string) => void
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
}

function SpanTreeRow({ node, depth, collapsed, onToggleCollapsed, selectedSpanId, onSelectSpan }: SpanTreeRowProps) {
  const hasChildren = node.children.length > 0
  const isCollapsed = collapsed.has(node.id)
  const isSelected = selectedSpanId === node.id

  const handleToggle = (event: MouseEvent) => {
    event.stopPropagation()
    onToggleCollapsed(node.id)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectSpan(node.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelectSpan(node.id)
          }
        }}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-neutral-800/40 focus-visible:ring-1 focus-visible:ring-accent',
          isSelected && 'bg-neutral-800/70',
        )}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isCollapsed ? 'Expand span' : 'Collapse span'}
            className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-500 hover:text-neutral-200"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', STATUS_DOT_CLASS[node.status])} />
        <span className="truncate text-neutral-200">{node.name}</span>
        {node.status === 'failed' && <AlertTriangle className="h-3 w-3 shrink-0 text-red-400" />}
      </div>

      {hasChildren && !isCollapsed && (
        <div>
          {node.children
            .slice()
            .sort((a, b) => a.startOffsetMs - b.startOffsetMs)
            .map((child) => (
              <SpanTreeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                collapsed={collapsed}
                onToggleCollapsed={onToggleCollapsed}
                selectedSpanId={selectedSpanId}
                onSelectSpan={onSelectSpan}
              />
            ))}
        </div>
      )}
    </div>
  )
}
