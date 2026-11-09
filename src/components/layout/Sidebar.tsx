import { ChevronsLeft, ChevronsRight, Workflow, X } from 'lucide-react'
import { Tooltip } from 'radix-ui'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { cn } from '@/lib/cn'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useLocalStorageState('agentreplay.sidebar-collapsed', false)

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <Tooltip.Provider delayDuration={200}>
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-800 bg-neutral-950 transition-[width,transform] duration-200',
            'lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            collapsed ? 'w-[72px]' : 'w-64',
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 px-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                <Workflow className="h-4 w-4" strokeWidth={2.25} />
              </div>
              {!collapsed && (
                <span className="truncate text-sm font-semibold tracking-tight text-neutral-100">
                  AgentReplay
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const link = (
                <NavLink
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-neutral-800/80 text-neutral-50'
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100',
                      collapsed && 'justify-center px-0',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              )

              if (!collapsed) {
                return <div key={item.path}>{link}</div>
              }

              return (
                <Tooltip.Root key={item.path}>
                  <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={8}
                      className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-100 shadow-lg"
                    >
                      {item.label}
                      <Tooltip.Arrow className="fill-neutral-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )
            })}
          </nav>

          <div className="border-t border-neutral-800 p-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>
      </Tooltip.Provider>
    </>
  )
}
