export const ERoutes = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TRACES: '/traces',
  REPLAYS: '/replays',
  EVALUATIONS: '/evaluations',
  SETTINGS: '/settings',
} as const

export type ERoutes = (typeof ERoutes)[keyof typeof ERoutes]
