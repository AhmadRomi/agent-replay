import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ERoutes } from '@/constants/routes'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { EvaluationsPage } from '@/features/evaluations/pages/EvaluationsPage'
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage'
import { ReplaysPage } from '@/features/replays/pages/ReplaysPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { TracesPage } from '@/features/traces/pages/TracesPage'
import NotFound from '@/pages/NotFound'

const withoutLeadingSlash = (path: ERoutes) => path.slice(1)

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={ERoutes.DASHBOARD} replace /> },
      { path: withoutLeadingSlash(ERoutes.DASHBOARD), element: <DashboardPage /> },
      { path: withoutLeadingSlash(ERoutes.PROJECTS), element: <ProjectsPage /> },
      { path: withoutLeadingSlash(ERoutes.TRACES), element: <TracesPage /> },
      { path: withoutLeadingSlash(ERoutes.REPLAYS), element: <ReplaysPage /> },
      { path: withoutLeadingSlash(ERoutes.EVALUATIONS), element: <EvaluationsPage /> },
      { path: withoutLeadingSlash(ERoutes.SETTINGS), element: <SettingsPage /> },
    ],
  },
  { path: ERoutes.LOGIN, element: <LoginPage /> },
  { path: '*', element: <NotFound /> },
])
