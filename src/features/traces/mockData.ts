import type { Span, SpanType, Trace, TraceStatus } from './types'

/**
 * Deterministic PRNG (mulberry32) so the generated filler traces are stable
 * across renders and reloads instead of using Math.random().
 */
function mulberry32(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pseudoHex(rng: () => number, length: number): string {
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += Math.floor(rng() * 16).toString(16)
  }
  return result
}

const AGENTS = [
  'support-triage-agent',
  'order-lookup-agent',
  'refund-processor',
  'kb-retrieval-agent',
  'billing-reconciliation-agent',
  'escalation-router',
]

const SPAN_IO: Record<SpanType, { input: string; output: string }> = {
  agent: { input: 'Incoming user request received for processing.', output: 'Execution completed.' },
  llm: {
    input: 'Prompt: classify and respond to the user message using the configured system instructions.',
    output: 'Completion generated with the resolved intent and draft response.',
  },
  tool: {
    input: '{ "action": "lookup", "params": { "id": "..." } }',
    output: '{ "status": "ok", "data": { "...": "..." } }',
  },
  retrieval: {
    input: 'query: "relevant policy or account context for this request"',
    output: 'Top-k documents retrieved and ranked by relevance.',
  },
  chain: {
    input: 'Intermediate context assembled from prior steps.',
    output: 'Context summarized for the next step.',
  },
}

const ERROR_MESSAGES = [
  'Payment gateway timeout after 3 retries (code: GATEWAY_TIMEOUT).',
  'Downstream service returned 503 Service Unavailable.',
  'Validation failed: missing required field "customer_id".',
  'Rate limit exceeded for upstream API (429).',
  'Unexpected null reference while parsing tool response.',
]

const now = Date.now()

function startedAtMinutesAgo(minutesAgo: number): string {
  return new Date(now - minutesAgo * 60_000).toISOString()
}

function makeSpan(span: Span): Span {
  return span
}

/**
 * Three hand-authored traces with realistic, multi-level span trees -
 * used as the primary examples for the trace details view.
 */
const curatedTraces: Trace[] = [
  {
    id: 'trc_7f3a9c2e1b8d4f06',
    agentName: 'support-triage-agent',
    status: 'success',
    startedAt: startedAtMinutesAgo(3),
    durationMs: 1850,
    spanCount: 7,
    totalTokens: 2140,
    estimatedCost: 0.0082,
    spans: [
      makeSpan({
        id: 'span_root',
        parentId: null,
        name: 'agent.run',
        type: 'agent',
        status: 'success',
        startOffsetMs: 0,
        durationMs: 1850,
        input: 'User: "I was charged twice for order #48213, can you help?"',
        output: 'Replied with explanation and refund confirmation for the duplicate charge.',
      }),
      makeSpan({
        id: 'span_classify',
        parentId: 'span_root',
        name: 'llm.classify_intent',
        type: 'llm',
        status: 'success',
        startOffsetMs: 20,
        durationMs: 310,
        input: SPAN_IO.llm.input,
        output: 'intent: billing_duplicate_charge, confidence: 0.94',
        metadata: { model: 'gpt-4.1-mini', temperature: 0.1 },
      }),
      makeSpan({
        id: 'span_lookup_customer',
        parentId: 'span_root',
        name: 'tool.lookup_customer',
        type: 'tool',
        status: 'success',
        startOffsetMs: 340,
        durationMs: 180,
        input: '{ "action": "lookup_customer", "order_id": "48213" }',
        output: '{ "status": "ok", "customer_id": "cus_3321", "orders": 2 }',
        metadata: { endpoint: '/internal/customers/lookup' },
      }),
      makeSpan({
        id: 'span_kb_search',
        parentId: 'span_root',
        name: 'retrieval.kb_search',
        type: 'retrieval',
        status: 'success',
        startOffsetMs: 530,
        durationMs: 420,
        input: 'query: "duplicate charge refund policy"',
        output: '3 documents retrieved (top_k=3)',
      }),
      makeSpan({
        id: 'span_embed_query',
        parentId: 'span_kb_search',
        name: 'retrieval.embed_query',
        type: 'retrieval',
        status: 'success',
        startOffsetMs: 540,
        durationMs: 90,
        input: '"duplicate charge refund policy"',
        output: 'embedding vector (1536 dims)',
      }),
      makeSpan({
        id: 'span_vector_search',
        parentId: 'span_kb_search',
        name: 'retrieval.vector_search',
        type: 'retrieval',
        status: 'success',
        startOffsetMs: 640,
        durationMs: 300,
        input: 'embedding vector (1536 dims)',
        output: '3 matches above threshold 0.78',
      }),
      makeSpan({
        id: 'span_compose_reply',
        parentId: 'span_root',
        name: 'llm.compose_reply',
        type: 'llm',
        status: 'success',
        startOffsetMs: 970,
        durationMs: 850,
        input: 'Draft a reply confirming the refund for the duplicate charge.',
        output: '"I can confirm the duplicate charge on order #48213 has been refunded..."',
        metadata: { model: 'gpt-4.1', temperature: 0.4 },
      }),
    ],
  },
  {
    id: 'trc_2c9e7a41f05b836d',
    agentName: 'refund-processor',
    status: 'failed',
    startedAt: startedAtMinutesAgo(18),
    durationMs: 3400,
    spanCount: 6,
    totalTokens: 1680,
    estimatedCost: 0.0046,
    spans: [
      makeSpan({
        id: 'span_root',
        parentId: null,
        name: 'agent.run',
        type: 'agent',
        status: 'failed',
        startOffsetMs: 0,
        durationMs: 3400,
        input: 'User: "Please refund my order #71045, item arrived damaged."',
        output: undefined,
        error: 'Refund could not be completed; customer was notified of the delay.',
      }),
      makeSpan({
        id: 'span_classify',
        parentId: 'span_root',
        name: 'llm.classify_request',
        type: 'llm',
        status: 'success',
        startOffsetMs: 15,
        durationMs: 260,
        input: SPAN_IO.llm.input,
        output: 'intent: refund_request, confidence: 0.98',
      }),
      makeSpan({
        id: 'span_fetch_order',
        parentId: 'span_root',
        name: 'tool.fetch_order',
        type: 'tool',
        status: 'success',
        startOffsetMs: 290,
        durationMs: 310,
        input: '{ "action": "fetch_order", "order_id": "71045" }',
        output: '{ "status": "ok", "amount": 84.5, "currency": "USD" }',
      }),
      makeSpan({
        id: 'span_process_refund',
        parentId: 'span_root',
        name: 'tool.process_refund',
        type: 'tool',
        status: 'failed',
        startOffsetMs: 620,
        durationMs: 2400,
        input: '{ "action": "process_refund", "order_id": "71045", "amount": 84.5 }',
        output: undefined,
        error: ERROR_MESSAGES[0],
        metadata: { endpoint: '/internal/payments/refund', retries: 3 },
      }),
      makeSpan({
        id: 'span_gateway_reversal',
        parentId: 'span_process_refund',
        name: 'tool.gateway_charge_reversal',
        type: 'tool',
        status: 'failed',
        startOffsetMs: 630,
        durationMs: 2380,
        input: '{ "charge_id": "ch_9f21", "amount": 84.5 }',
        output: undefined,
        error: 'Connection reset by peer while awaiting gateway response.',
      }),
      makeSpan({
        id: 'span_notify_customer',
        parentId: 'span_root',
        name: 'llm.notify_customer',
        type: 'llm',
        status: 'success',
        startOffsetMs: 3040,
        durationMs: 340,
        input: 'Draft a message explaining the refund delay and next steps.',
        output: '"We hit an issue processing your refund and are retrying automatically..."',
      }),
    ],
  },
  {
    id: 'trc_9b1d4f7c3a6e0852',
    agentName: 'kb-retrieval-agent',
    status: 'running',
    startedAt: startedAtMinutesAgo(0.7),
    durationMs: 640,
    spanCount: 5,
    totalTokens: 640,
    estimatedCost: 0.0021,
    spans: [
      makeSpan({
        id: 'span_root',
        parentId: null,
        name: 'agent.run',
        type: 'agent',
        status: 'running',
        startOffsetMs: 0,
        durationMs: 640,
        input: 'User: "What is our policy on international shipping delays?"',
        output: undefined,
      }),
      makeSpan({
        id: 'span_classify',
        parentId: 'span_root',
        name: 'llm.classify_intent',
        type: 'llm',
        status: 'success',
        startOffsetMs: 10,
        durationMs: 180,
        input: SPAN_IO.llm.input,
        output: 'intent: policy_question, confidence: 0.91',
      }),
      makeSpan({
        id: 'span_kb_search',
        parentId: 'span_root',
        name: 'retrieval.kb_search',
        type: 'retrieval',
        status: 'success',
        startOffsetMs: 200,
        durationMs: 300,
        input: 'query: "international shipping delay policy"',
        output: '2 documents retrieved (top_k=4)',
      }),
      makeSpan({
        id: 'span_vector_search',
        parentId: 'span_kb_search',
        name: 'retrieval.vector_search',
        type: 'retrieval',
        status: 'success',
        startOffsetMs: 210,
        durationMs: 280,
        input: 'embedding vector (1536 dims)',
        output: '2 matches above threshold 0.78',
      }),
      makeSpan({
        id: 'span_compose_reply',
        parentId: 'span_root',
        name: 'llm.compose_reply',
        type: 'llm',
        status: 'running',
        startOffsetMs: 510,
        durationMs: 130,
        input: 'Draft a reply summarizing the shipping delay policy.',
        output: undefined,
      }),
    ],
  },
]

const CHILD_SPAN_POOL: Array<{ name: string; type: SpanType }> = [
  { name: 'llm.classify_intent', type: 'llm' },
  { name: 'llm.compose_reply', type: 'llm' },
  { name: 'tool.lookup_customer', type: 'tool' },
  { name: 'tool.fetch_order', type: 'tool' },
  { name: 'tool.update_ticket', type: 'tool' },
  { name: 'retrieval.kb_search', type: 'retrieval' },
  { name: 'chain.summarize_context', type: 'chain' },
]

// Spread across last-hour / last-24h / last-7d / older-than-7d buckets so the
// time-range filter has something to include and exclude at every setting.
const FILLER_AGE_MINUTES = [
  5, 12, 28, 45, 70, 140, 220, 340, 480, 650, 900, 1300, 1700, 2200, 4200, 6400, 9800, 14500, 19000,
]

function generateFillerTraces(): Trace[] {
  const traces: Trace[] = []

  FILLER_AGE_MINUTES.forEach((ageMinutes, index) => {
    const rng = mulberry32(1000 + index * 97)
    const agentName = AGENTS[index % AGENTS.length]

    const statusRoll = rng()
    const status: TraceStatus = statusRoll < 0.72 ? 'success' : statusRoll < 0.9 ? 'failed' : 'running'

    const childCount = 2 + Math.floor(rng() * 3)
    const pool = [...CHILD_SPAN_POOL]
    const children: Array<{ name: string; type: SpanType }> = []
    for (let i = 0; i < childCount && pool.length > 0; i += 1) {
      const pickIndex = Math.floor(rng() * pool.length)
      children.push(pool.splice(pickIndex, 1)[0])
    }

    let cursor = 10 + Math.floor(rng() * 30)
    const spans: Span[] = []
    children.forEach((child, childIndex) => {
      const isLast = childIndex === children.length - 1
      const duration = Math.round(80 + rng() * 500)
      const isFailingSpan = status === 'failed' && isLast
      const isRunningSpan = status === 'running' && isLast
      const io = SPAN_IO[child.type]

      spans.push(
        makeSpan({
          id: `span_${index}_${childIndex}`,
          parentId: 'span_root',
          name: child.name,
          type: child.type,
          status: isFailingSpan ? 'failed' : isRunningSpan ? 'running' : 'success',
          startOffsetMs: cursor,
          durationMs: duration,
          input: io.input,
          output: isRunningSpan ? undefined : io.output,
          error: isFailingSpan ? ERROR_MESSAGES[index % ERROR_MESSAGES.length] : undefined,
        }),
      )
      cursor += duration + Math.floor(rng() * 40)
    })

    const rootDuration = Math.max(cursor, 300)

    spans.unshift(
      makeSpan({
        id: 'span_root',
        parentId: null,
        name: 'agent.run',
        type: 'agent',
        status,
        startOffsetMs: 0,
        durationMs: rootDuration,
        input: SPAN_IO.agent.input,
        output: status === 'running' ? undefined : SPAN_IO.agent.output,
        error: status === 'failed' ? 'One or more steps failed; see the failed span for details.' : undefined,
      }),
    )

    const totalTokens = Math.round(400 + rng() * 3000)
    const estimatedCost = Number((totalTokens * 0.000014 + rng() * 0.01).toFixed(4))

    traces.push({
      id: `trc_${pseudoHex(rng, 16)}`,
      agentName,
      status,
      startedAt: startedAtMinutesAgo(ageMinutes),
      durationMs: rootDuration,
      spanCount: spans.length,
      totalTokens,
      estimatedCost,
      spans,
    })
  })

  return traces
}

export const mockTraces: Trace[] = [...curatedTraces, ...generateFillerTraces()]
