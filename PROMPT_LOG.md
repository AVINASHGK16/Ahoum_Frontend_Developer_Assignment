## Prompt 001 — Frontend Foundation

### Tool / Model
Antigravity

### Objective
Establish the frontend foundation according to ArchitectureV1.md.

### Prompt
We are implementing the Ahoum Frontend Developer Assignment.

Before making any changes, inspect the existing repository and read:
- README.md
- DECISIONS.md
- ArchitectureV1.md

ArchitectureV1.md is the source of truth for the current technical
architecture. Do not replace or redesign it.

TASK 001 — Establish the frontend foundation only.

Implement ONLY the project foundation required by Architecture V1:

1. Create/configure a Vite + React application.
2. Use TypeScript with strict mode enabled.
3. Configure Tailwind CSS.
4. Add React Router for client-side routing.
5. Add Zustand for global state.
6. Establish the initial src directory structure described in
   ArchitectureV1.md where files are required for the foundation.
7. Create the minimum application entry point required for the app
   to start successfully.
8. Keep the application compilable and runnable.

Technical constraints:
- TypeScript strict mode.
- Do not use `any`.
- Do not use Redux, MobX, or Context API for global state.
- Do not install a UI component library.
- Do not add dependencies unless they are required for this task.
- Follow the architecture boundaries documented in ArchitectureV1.md.
- Keep global state limited to the responsibilities defined by the
  architecture.
- Do not create application features prematurely.

DO NOT implement:
- Grocery catalog UI
- Product cards
- Search functionality
- Cart functionality
- Checkout
- Mock API
- Product/category data
- Authentication
- Responsive visual design
- Additional features not required for this foundation task

Do not modify DECISIONS.md or ArchitectureV1.md.

Before finishing:
1. Run the appropriate build/type-check verification.
2. Report the exact files created or modified.
3. Report the dependencies added.
4. Report the verification command and result.
5. Report any assumptions or issues encountered.

If an existing project configuration conflicts with these requirements,
stop and explain the conflict rather than silently replacing unrelated
configuration.

### What AI Implemented
- Vite + React foundation
- TypeScript strict configuration
- Tailwind CSS
- React Router
- Zustand
- Initial application structure
- Minimal route/page/store/type foundations

### What Was Accepted
The implementation was accepted because it matched the requested scope and passed
type-checking and production build verification.

### Verification
- `npm run typecheck` — passed
- `npm run build` — passed
- React Router wiring reviewed
- Zustand store scope reviewed
- Dependencies reviewed
- No UI component library / Redux / MobX / Context API introduced

# AI Development Prompt Log

This document records the prompts provided to the AI coding agent, the resulting implementation, verification performed, engineering review, and any issues identified during development.

The purpose of this log is to maintain a transparent record of AI-assisted development and demonstrate how implementation decisions were reviewed rather than accepted without verification.

---

## Prompt 002 — Mock Data & Mock API V1

### Status

**Completed and reviewed**

### Objective

Implement the static mock catalog data and a mock API layer that can be consumed by the application without coupling UI components directly to the underlying JSON data.

The implementation should follow `ArchitectureV1.md`, preserve the existing project structure, use strict TypeScript, and avoid unnecessary dependencies.

### Prompt Given to AI

> Implement the mock data and mock API layer according to the existing `ArchitectureV1.md` and `DECISIONS.md`.
>
> Create realistic static grocery catalog data under `src/data/`.
>
> Expand the existing product and API types where necessary to represent the catalog and API behavior.
>
> Create separate mock API services for:
>
> - Products
> - Categories
> - Search
>
> The UI must consume the mock API layer rather than importing JSON data directly.
>
> The mock API should simulate asynchronous network behavior using Promise-based variable latency.
>
> Support controlled API failure through an optional `shouldFail` option so loading, error, and retry states can be tested later.
>
> Keep stale-response handling out of the API layer; that responsibility belongs to the application/hook layer.
>
> Do not modify pages, components, Zustand stores, routing, or unrelated documentation.
>
> Do not add unnecessary dependencies.
>
> Maintain TypeScript strict mode and do not use `any`.
>
> After implementation, run typecheck and production build and report the exact files changed, assumptions, and issues encountered.

---

### AI Implementation

The AI created the following static datasets:

- `src/data/categories.json`
- `src/data/products.json`

The dataset contains:

- 6 grocery categories
- 24 grocery products
- product/category relationships
- prices
- units
- stock status
- ratings
- product tags

The existing types were expanded:

- `src/types/product.ts`
- `src/types/api.ts`

The mock API layer was implemented under:

```text
src/services/mockApi/
├── productsApi.ts
├── categoriesApi.ts
└── searchApi.ts

  ---

### Prompt 003 — Data Fetching Hooks V1

### Objective
Implement the React data-fetching hook layer between UI components and the existing mock API.

### Prompt Given to AI
Implement only the React data-fetching hooks required to consume the existing mock API.

Create `useProducts.ts` and `useSearch.ts` under `src/hooks/`.

Follow ArchitectureV1, DESIGN_NOTES, existing types, and mock API.

Establish strongly typed loading, success, and error states.

`useProducts` should support fetching product data and retrying after failure.

`useSearch` should consume `searchProducts` and protect the UI from stale/out-of-order responses when multiple searches are issued.

Do not add dependencies or modify unrelated files.

Use TypeScript strict mode with no `any`.

Run typecheck and production build after implementation.

### AI Implementation
Created:
- `src/hooks/useProducts.ts`
- `src/hooks/useSearch.ts`

The implementation introduced:
- typed loading/error/data states
- retry through `refetch`
- component cleanup protection for effect-driven requests
- request-ID based stale-response protection
- stale-error protection
- invalidation of in-flight searches after `clearResults`

### Verification
AI ran:

`npm run typecheck; npm run build`

Result:
- TypeScript typecheck: PASS
- Production build: PASS

### Engineering Review
The generated implementation was manually reviewed after the AI reported completion.

The review specifically examined:
- loading transitions
- error handling
- retry behavior
- effect cleanup
- dependency arrays
- request sequencing
- stale success responses
- stale error responses
- clear-results invalidation
- TypeScript strictness

### Debugging / AI Failure Analysis
No functional AI defect was identified during review.

A deliberate out-of-order execution scenario was traced:

`search("apple") → search("milk") → milk resolves → apple resolves`

The newer `"milk"` response was accepted while the older `"apple"` response was discarded because its request ID no longer matched the active request ID.

A second failure scenario was also verified:

`older request fails → newer request already active`

The stale error was discarded and could not overwrite the newer request's state.

### Observations
Two minor hardening opportunities were identified:
1. Imperative `refetch()` unmount behavior could be further hardened if required.
2. `useSearch` could invalidate requests during unmount through explicit cleanup.

Neither was treated as a blocking defect because neither produced a demonstrated functional failure in the current architecture.

### Result
Task 003 approved for commit.

### Files Changed
- `src/hooks/useProducts.ts`
- `src/hooks/useSearch.ts`
- `PROMPT_LOG.md`

### Commit
`feat: add data fetching hooks`


## Prompt 004 — UI Foundation V1

### Objective
Implement the reusable UI foundation according to `ArchitectureV1.md` and `DESIGN_NOTES.md`, without implementing page-specific business logic.

### Condensed Prompt
Implement the UI foundation layer:
- Create `AppLayout` and `Header`.
- Create reusable `ProductCard`.
- Create `LoadingSpinner`, `ErrorMessage`, and `EmptyState`.
- Follow the existing architecture and visual system.
- Keep components presentational and reusable.
- Do not modify pages, stores, hooks, mock APIs, data, routes, or architecture/design documentation.
- Maintain strict TypeScript and accessibility.
- Run typecheck and production build after implementation.

### Implementation Result
Created:
- `src/components/layout/Header.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/feedback/LoadingSpinner.tsx`
- `src/components/feedback/ErrorMessage.tsx`
- `src/components/feedback/EmptyState.tsx`

The components remain within their intended architectural boundaries and do not introduce data-fetching or business logic.

### AI Mistakes / Corrections
- No functional implementation mistakes were identified during the Task 004 review.
- The generated report contained a minor documentation typo in the `EmptyState.tsx` file reference (`]j`), but this was only a report typo and not a code issue.

### Verification
- `npm run typecheck` — PASS
- `npm run build` — PASS
- TypeScript errors: 0
- Build errors: 0

### Commit
feat: add UI foundation