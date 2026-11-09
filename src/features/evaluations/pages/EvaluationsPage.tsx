import { ClipboardCheck } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function EvaluationsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Evaluations" description="Score agent executions against defined quality criteria." />
      <EmptyState
        icon={ClipboardCheck}
        title="No evaluations yet"
        description="Set up an evaluation to start scoring agent executions automatically."
      />
    </div>
  )
}
