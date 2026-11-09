import { cn } from '@/lib/cn'
import { TIME_RANGE_OPTIONS } from '../utils'
import type { TimeRange } from '../utils'

interface TimeRangeControlProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

export function TimeRangeControl({ value, onChange }: TimeRangeControlProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-neutral-800 bg-neutral-900/60 p-0.5">
      {TIME_RANGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[5px] px-2.5 py-1.5 text-xs font-medium transition-colors',
            value === option.value
              ? 'bg-neutral-800 text-neutral-50'
              : 'text-neutral-400 hover:text-neutral-100',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
