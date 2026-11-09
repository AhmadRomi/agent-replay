import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { AgentStatus } from '../mockData'

interface AgentStatusListProps {
  agents: AgentStatus[]
}

export function AgentStatusList({ agents }: AgentStatusListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-medium text-neutral-100">Agents</h2>
      <ul className="space-y-3">
        {agents.map((agent) => (
          <li key={agent.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  agent.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500',
                )}
              />
              <span className="truncate font-mono text-xs text-neutral-300">{agent.name}</span>
            </div>
            <span className="shrink-0 text-xs text-neutral-500">{agent.executions.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
