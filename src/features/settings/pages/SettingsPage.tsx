import { Settings } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Settings" description="Manage workspace, API keys, and integrations." />
      <EmptyState
        icon={Settings}
        title="Nothing to configure yet"
        description="Workspace and integration settings will show up here."
      />
    </div>
  )
}
