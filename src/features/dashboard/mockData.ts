export interface OverviewStat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
}

export const mockOverviewStats: OverviewStat[] = [
  { label: 'Total executions', value: '12,482', change: '+8.2%', trend: 'up' },
  { label: 'Success rate', value: '98.4%', change: '+0.3%', trend: 'up' },
  { label: 'Avg. latency', value: '842ms', change: '-4.1%', trend: 'up' },
  { label: 'Active agents', value: '24', change: '+2', trend: 'up' },
]

export interface ActivityPoint {
  day: string
  executions: number
}

export const mockActivity: ActivityPoint[] = [
  { day: 'Mon', executions: 420 },
  { day: 'Tue', executions: 532 },
  { day: 'Wed', executions: 601 },
  { day: 'Thu', executions: 489 },
  { day: 'Fri', executions: 712 },
  { day: 'Sat', executions: 298 },
  { day: 'Sun', executions: 341 },
]

export interface MockTrace {
  id: string
  agent: string
  status: 'success' | 'error' | 'running'
  duration: string
  startedAt: string
}

export const mockRecentTraces: MockTrace[] = [
  { id: 'trc_8f2a91', agent: 'support-triage-agent', status: 'success', duration: '1.2s', startedAt: '2 min ago' },
  { id: 'trc_7d13c4', agent: 'order-lookup-agent', status: 'success', duration: '640ms', startedAt: '6 min ago' },
  { id: 'trc_6b90ee', agent: 'refund-processor', status: 'error', duration: '3.4s', startedAt: '14 min ago' },
  { id: 'trc_5a2f10', agent: 'kb-retrieval-agent', status: 'running', duration: '—', startedAt: '19 min ago' },
  { id: 'trc_491cd8', agent: 'support-triage-agent', status: 'success', duration: '980ms', startedAt: '27 min ago' },
]

export interface AgentStatus {
  name: string
  status: 'healthy' | 'degraded'
  executions: number
}

export const mockAgentStatus: AgentStatus[] = [
  { name: 'support-triage-agent', status: 'healthy', executions: 3210 },
  { name: 'order-lookup-agent', status: 'healthy', executions: 2894 },
  { name: 'refund-processor', status: 'degraded', executions: 1142 },
  { name: 'kb-retrieval-agent', status: 'healthy', executions: 987 },
]
