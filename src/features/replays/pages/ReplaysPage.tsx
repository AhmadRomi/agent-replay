import { PlayCircle } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function ReplaysPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Replays" description="Re-run past executions to debug and compare behavior." />
      <EmptyState
        icon={PlayCircle}
        title="No replays yet"
        description="Replay a trace to step through an agent's execution again."
      />
    </div>
  )
}
