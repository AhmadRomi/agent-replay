import { useState } from 'react'
import { Workflow } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Workflow className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <h1 className="text-lg font-semibold text-neutral-50">Sign in to AgentReplay</h1>
          <p className="text-center text-sm text-neutral-500">
            Inspect, debug, and replay your agent executions.
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-neutral-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-neutral-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-600">
          Authentication is not yet connected — this is a UI scaffold.
        </p>
      </div>
    </div>
  )
}
