import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'

interface TopbarProps {
  onMobileMenuClick: () => void
}

export function Topbar({ onMobileMenuClick }: TopbarProps) {
  const location = useLocation()
  const current = NAV_ITEMS.find((item) => item.path === location.pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-800 px-4 lg:px-6">
      <button
        type="button"
        onClick={onMobileMenuClick}
        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="truncate text-sm font-medium text-neutral-200">{current?.label ?? 'AgentReplay'}</h1>
    </header>
  )
}
