import { ERoutes } from '@/constants/routes'

export function buildTraceDetailsPath(traceId: string): string {
  return `${ERoutes.TRACES}/${traceId}`
}
