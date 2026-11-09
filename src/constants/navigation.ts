import {
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  PlayCircle,
  Settings,
  Workflow,
} from 'lucide-react'
import { ERoutes } from './routes'

export interface NavItem {
  label: string
  path: ERoutes
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ERoutes.DASHBOARD, icon: LayoutDashboard },
  { label: 'Projects', path: ERoutes.PROJECTS, icon: FolderKanban },
  { label: 'Traces', path: ERoutes.TRACES, icon: Workflow },
  { label: 'Replays', path: ERoutes.REPLAYS, icon: PlayCircle },
  { label: 'Evaluations', path: ERoutes.EVALUATIONS, icon: ClipboardCheck },
  { label: 'Settings', path: ERoutes.SETTINGS, icon: Settings },
]
