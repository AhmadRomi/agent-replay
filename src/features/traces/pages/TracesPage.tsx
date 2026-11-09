import { Workflow } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function TracesPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Traces" description="Inspect step-by-step execution traces from your agents." />
      <EmptyState
        icon={Workflow}
        title="No traces yet"
        description="Traces from connected agents will appear here as they run."
      />
    </div>
  )
}
