export type TraceStatus = 'success' | 'failed' | 'running'
export type SpanStatus = 'success' | 'failed' | 'running'
export type SpanType = 'agent' | 'llm' | 'tool' | 'retrieval' | 'chain'

export type SpanMetadataValue = string | number | boolean
export type SpanMetadata = Record<string, SpanMetadataValue>

export interface Span {
  id: string
  parentId: string | null
  name: string
  type: SpanType
  status: SpanStatus
  startOffsetMs: number
  durationMs: number
  input?: string
  output?: string
  error?: string
  metadata?: SpanMetadata
}

export interface Trace {
  id: string
  agentName: string
  status: TraceStatus
  startedAt: string
  durationMs: number
  spanCount: number
  totalTokens: number
  estimatedCost: number
  spans: Span[]
}
