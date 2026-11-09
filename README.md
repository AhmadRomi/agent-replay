# AgentReplay

AgentReplay is a developer tool for observing, debugging, and replaying AI agent executions — a single place to see what an agent actually did, step by step, instead of piecing it together from scattered logs.

## Why

AI agents make multiple decisions per request — classifying intent, calling tools, retrieving context, invoking an LLM, calling other tools again — and when something goes wrong, that chain of steps is usually scattered across logs, traces, and provider dashboards that don't talk to each other. AgentReplay aims to give developers one surface to inspect an agent's execution end-to-end: what ran, in what order, how long each step took, and exactly where and why it failed.

The project is in active development. The UI and interaction patterns below are implemented and functional against realistic mock data; backend integration, authentication, and the replay/evaluation engines are not built yet (see [Status & Roadmap](#status--roadmap)).

## Features implemented today

- **Dashboard** — execution overview with summary metrics, a 7-day activity chart, per-agent status, and a recent-traces table.
- **Traces Explorer** (`/traces`) — the most complete feature so far:
  - Overview metrics (total traces, success rate, average duration, failed traces) scoped to a selectable time range (last hour / 24 hours / 7 days).
  - A traces table with search (by trace ID or agent name), status filtering, sorting (by start time or duration), pagination, and loading/empty/error states.
  - **Trace details** (`/traces/:traceId`) — full trace header with copyable ID, summary metrics (duration, span count, token usage, estimated cost), a CSS-based horizontal span waterfall, and a collapsible span tree with an inspector panel showing input/output, metadata, and error details for failed spans.
- **Application shell** — collapsible sidebar (state persisted locally) with active-route highlighting and icon tooltips when collapsed, a mobile slide-out drawer, a top bar, and a dark-first design system built on Tailwind CSS v4.
- **Routing scaffold** — Projects, Replays, Evaluations, and Settings each have a routed page with a heading and an empty state, ready to be built out.
- **Login screen** (`/login`) — a static UI scaffold only; there is no authentication logic behind it yet.

All data in the app today is realistic, deterministic mock data generated client-side — there is no backend yet.

## Screenshots

> _Screenshots coming soon._

| Dashboard | Traces Explorer | Trace Details |
| --- | --- | --- |
| _placeholder_ | _placeholder_ | _placeholder_ |

## Tech stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** (strict mode)
- **[Vite](https://vite.dev/)** — dev server and build
- **[React Router](https://reactrouter.com/)** (`react-router-dom`) — routing, including nested layout routes
- **[Tailwind CSS v4](https://tailwindcss.com/)** via `@tailwindcss/vite` — styling and design tokens
- **[Recharts](https://recharts.org/)** — the dashboard activity chart
- **[Radix UI](https://www.radix-ui.com/primitives)** (`radix-ui` package) — accessible primitives (currently: sidebar tooltips)
- **[Lucide React](https://lucide.dev/)** — icons
- **[Zustand](https://github.com/pmndrs/zustand)** — installed for future shared state; no store exists yet, since nothing currently requires cross-component state
- **ESLint** + **typescript-eslint** — linting

No test framework is configured yet.

## Architecture

The app follows a feature-based structure: shared app-level concerns live under `app/` and `components/`, and each product area owns its own folder under `features/`.

```
src/
  app/
    router/        # Centralized route configuration (createBrowserRouter)
  components/
    layout/        # AppShell, Sidebar, Topbar
    ui/            # Shared primitives: Card, StatCard, StatusBadge, Pagination, EmptyState, PageHeader
  features/
    dashboard/      # Dashboard page, components, mock data
    traces/         # Traces list + trace details: pages, components, types, mock data, utils
    projects/       # Routed page, empty state (not yet built out)
    replays/        # Routed page, empty state (not yet built out)
    evaluations/    # Routed page, empty state (not yet built out)
    settings/       # Routed page, empty state (not yet built out)
    auth/           # Login page (UI only)
  constants/        # Route paths (ERoutes), sidebar navigation config
  hooks/            # Shared hooks (e.g. useLocalStorageState)
  lib/              # Small shared utilities (e.g. cn for className merging)
  pages/
    NotFound/       # 404 page
  styles/
    globals.css     # Tailwind entry point + design tokens (@theme)
```

Routing is centralized in `src/app/router/index.tsx`. Routes under the app shell (`Dashboard`, `Projects`, `Traces`, trace details, `Replays`, `Evaluations`, `Settings`) render inside a persistent layout with the sidebar and top bar; `/login` and the 404 page render standalone. The index route (`/`) redirects to `/dashboard`.

Within a feature folder, presentation, data, and logic are kept separate — for example `features/traces/` splits `types.ts` (domain types), `mockData.ts` (data, deterministically generated), `utils.ts` (formatting, filtering, sorting, span-tree helpers), `components/` (presentational pieces), and `pages/` (route-level composition).

## Getting started

### Prerequisites

- Node.js 20 or later
- npm (the project uses `package-lock.json`)

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

Starts Vite on `http://localhost:3000` (configured in `vite.config.ts`).

### Build

```bash
npm run build
```

Type-checks the project (`tsc -b`) and produces a production build in `dist/` via Vite.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Tests

No test suite is configured yet.

## Status & roadmap

**Current status:** UI foundation and the Traces Explorer are functional against mock data. No backend, authentication, or persistence exists yet.

**Planned next:**
- Backend/API integration to replace mock data with real trace ingestion.
- Authentication, wired up to the existing login screen.
- Replay functionality — re-running a recorded trace step by step.
- Evaluations — scoring executions against defined criteria.
- Projects — grouping traces and replays by workspace.
