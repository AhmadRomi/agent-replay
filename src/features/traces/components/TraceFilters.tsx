import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SORT_OPTIONS } from '../utils'
import type { SortOption, StatusFilter } from '../utils'

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'running', label: 'Running' },
]

interface TraceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  sortBy: SortOption
  onSortByChange: (value: SortOption) => void
  resultCount: number
  hasActiveFilters: boolean
  onClear: () => void
}

export function TraceFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  resultCount,
  hasActiveFilters,
  onClear,
}: TraceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by trace ID or agent"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/60 py-1.5 pl-8 pr-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="inline-flex items-center rounded-md border border-neutral-800 bg-neutral-900/60 p-0.5">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={cn(
                'rounded-[5px] px-2.5 py-1.5 text-xs font-medium transition-colors',
                status === option.value ? 'bg-neutral-800 text-neutral-50' : 'text-neutral-400 hover:text-neutral-100',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as SortOption)}
          className="rounded-md border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-medium text-neutral-300 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <span className="shrink-0 text-xs text-neutral-500">
        {resultCount.toLocaleString()} {resultCount === 1 ? 'result' : 'results'}
      </span>
    </div>
  )
}
