import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '@/components/ui/Pagination'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/cn'
import { TraceFilters } from '../components/TraceFilters'
import { TraceMetrics } from '../components/TraceMetrics'
import { TimeRangeControl } from '../components/TimeRangeControl'
import { TracesTable } from '../components/TracesTable'
import { mockTraces } from '../mockData'
import { buildTraceDetailsPath } from '../routes'
import { computeTraceMetrics, filterAndSortTraces, filterByTimeRange } from '../utils'
import type { SortOption, StatusFilter, TimeRange } from '../utils'

const PAGE_SIZE = 10

export function TracesPage() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const tracesInRange = useMemo(() => filterByTimeRange(mockTraces, timeRange), [timeRange])
  const metrics = useMemo(() => computeTraceMetrics(tracesInRange), [tracesInRange])

  const filteredTraces = useMemo(
    () => filterAndSortTraces(tracesInRange, { search, status, sortBy }),
    [tracesInRange, search, status, sortBy],
  )

  // Reset to page 1 whenever a filter changes, following React's guidance to
  // adjust state during render instead of in an effect.
  const [appliedQuery, setAppliedQuery] = useState({ timeRange, search, status, sortBy })
  if (
    appliedQuery.timeRange !== timeRange ||
    appliedQuery.search !== search ||
    appliedQuery.status !== status ||
    appliedQuery.sortBy !== sortBy
  ) {
    setAppliedQuery({ timeRange, search, status, sortBy })
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filteredTraces.length / PAGE_SIZE))
  const paginatedTraces = filteredTraces.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilters = search !== '' || status !== 'all' || sortBy !== 'newest'

  const handleClearFilters = () => {
    setSearch('')
    setStatus('all')
    setSortBy('newest')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Traces" description="Inspect and debug your AI agent executions." />
        <div className="flex items-center gap-2">
          <TimeRangeControl value={timeRange} onChange={setTimeRange} />
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh traces"
            className="rounded-md border border-neutral-800 bg-neutral-900/60 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-60"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      <TraceMetrics metrics={metrics} />

      <TraceFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        resultCount={filteredTraces.length}
        hasActiveFilters={hasActiveFilters}
        onClear={handleClearFilters}
      />

      <TracesTable
        traces={paginatedTraces}
        isLoading={isRefreshing}
        error={null}
        onRowClick={(traceId) => navigate(buildTraceDetailsPath(traceId))}
      />

      {filteredTraces.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredTraces.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
