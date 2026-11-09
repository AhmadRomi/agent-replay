import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { MockTrace } from '../mockData'

const STATUS_STYLES: Record<MockTrace['status'], string> = {
  success: 'text-emerald-400 bg-emerald-500/10',
  error: 'text-red-400 bg-red-500/10',
  running: 'text-accent bg-accent/10',
}

interface RecentTracesTableProps {
  traces: MockTrace[]
}

export function RecentTracesTable({ traces }: RecentTracesTableProps) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <h2 className="text-sm font-medium text-neutral-100">Recent traces</h2>
        <span className="text-xs text-neutral-500">Mock data</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-2.5 font-medium">Trace ID</th>
              <th className="px-5 py-2.5 font-medium">Agent</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Duration</th>
              <th className="px-5 py-2.5 font-medium">Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {traces.map((trace) => (
              <tr key={trace.id} className="text-neutral-300">
                <td className="px-5 py-3 font-mono text-xs text-neutral-400">{trace.id}</td>
                <td className="px-5 py-3">{trace.agent}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      STATUS_STYLES[trace.status],
                    )}
                  >
                    {trace.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-neutral-400">{trace.duration}</td>
                <td className="px-5 py-3 text-neutral-500">{trace.startedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
