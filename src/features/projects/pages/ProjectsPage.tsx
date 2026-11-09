import { FolderKanban } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function ProjectsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Projects" description="Group traces and replays by project." />
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Projects will let you organize agent executions by workspace once you connect one."
      />
    </div>
  )
}
