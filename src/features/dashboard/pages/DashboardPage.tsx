import { PageHeader } from '@/components/ui/PageHeader'
import { ActivityChart } from '../components/ActivityChart'
import { AgentStatusList } from '../components/AgentStatusList'
import { OverviewStatCard } from '../components/OverviewStatCard'
import { RecentTracesTable } from '../components/RecentTracesTable'
import { mockActivity, mockAgentStatus, mockOverviewStats, mockRecentTraces } from '../mockData'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview of agent executions across your projects." />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockOverviewStats.map((stat) => (
          <OverviewStatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityChart data={mockActivity} />
        <AgentStatusList agents={mockAgentStatus} />
      </section>

      <RecentTracesTable traces={mockRecentTraces} />
    </div>
  )
}
