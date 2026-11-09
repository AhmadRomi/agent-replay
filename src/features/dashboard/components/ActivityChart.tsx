import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/ui/Card'
import type { ActivityPoint } from '../mockData'

interface ActivityChartProps {
  data: ActivityPoint[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <Card className="lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-100">Activity overview</h2>
        <span className="text-xs text-neutral-500">Mock data · last 7 days</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#27272a" strokeDasharray="4 4" />
            <XAxis dataKey="day" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e5e5e5' }}
            />
            <Area type="monotone" dataKey="executions" stroke="#8b5cf6" strokeWidth={2} fill="url(#activityFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
