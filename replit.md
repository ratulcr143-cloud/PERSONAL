# Astral AI Portfolio

A premium, responsive single-page portfolio for an AI/ML engineer and software developer, presented through an astronomical research-lab visual language.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/astral-ai-portfolio/src/App.tsx` — portfolio content, section components, interaction state, and editable data arrays
- `artifacts/astral-ai-portfolio/src/index.css` — theme tokens, responsive layout rules, atmospheric effects, and motion fallbacks
- `artifacts/astral-ai-portfolio/src/components/` — reusable scaffolded UI primitives and the error boundary

## Architecture decisions

- This is a presentation-first, frontend-only portfolio; portfolio content is intentionally stored in local typed constants for easy editing in VS Code.
- Framer Motion handles scroll reveals, project transitions, modal motion, and mobile navigation; lightweight starfield and cursor effects stay in CSS.
- The default experience is dark, with a client-side light theme toggle and reduced-motion fallbacks for accessibility.

## Product

- Single-page recruiter-facing portfolio with hero typing treatment, responsive navigation, project filtering and detail modal, research archive, orbital skills visualization, experience timeline, testimonial, and contact success state.
- The visual system uses deep space black, cosmic violet, cyan instrumentation, and gold signal accents with Space Grotesk, Inter, and DM Mono typography.

## User preferences

- Keep the portfolio easy to edit and extend directly in VS Code.

## Gotchas

- The web workflow provides `PORT` and `BASE_PATH`; use the managed artifact workflow for preview rather than starting Vite manually.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
