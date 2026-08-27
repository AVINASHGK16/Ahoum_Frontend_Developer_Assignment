# Engineering Decisions

# Decision 001 — Adopt Official Figma as Visual Source of Truth

## Problem

The official Figma design was initially unavailable when implementation began.
A documented internal mobile-first visual system was therefore used to avoid
blocking architectural and functional development.

The official Figma design has now been received.

## Decision

The official Figma is now the primary visual source of truth for the frontend.

Existing architectural, data-access, state-management, hook, and API boundaries
will be preserved unless the Figma reveals a genuine functional requirement
that requires architectural adjustment.

The provisional visual system is no longer authoritative. All new UI work must be derived from the official Figma unless a deliberate implementation adaptation is documented.

## Rationale

The existing architecture was intentionally separated from presentation logic.
Rebuilding the project would discard completed engineering work without
providing a technical benefit.

Adopting the Figma at the presentation layer allows visual fidelity to improve
while preserving the existing application boundaries and tested functionality.

## Trade-off

Some existing UI implementation will need to be revised or replaced.
However, this is preferable to rebuilding stable data, state, routing, hooks,
and architectural foundations.

---

## Decision 002 — Separate UI, Data Access, and Shared State Responsibilities

### Problem

The application contains asynchronous data fetching, shared cart/favorites state,
static mock data, and multiple screens that consume the same information.

Putting these responsibilities directly inside page components would make the
application harder to reason about and would tightly couple UI code to
implementation details.

### Options Considered

1. **Keep API calls and shared state directly inside pages/components**

   - Fewer files.
   - Simpler initially.
   - Makes asynchronous behaviour and shared state harder to isolate and test.

2. **Use a single global state layer for everything**

   - Centralizes application behaviour.
   - Creates unnecessary global state and weakens ownership boundaries.

3. **Separate presentation, reusable asynchronous logic, data access, and genuinely
   shared state**

   - Requires more structure.
   - Makes ownership and debugging clearer.

### Decision

Choose **Option 3**.

The application follows these boundaries:

```text
                    Pages / Components
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
     Hooks / Application Logic      Zustand Stores
             │                       (shared state)
             ↓
         Mock API
             ↓
       Static JSON

# Decision 003 — Keep Full-Screen Entry Screens Outside AppLayout

## Problem

The official Figma contains full-screen entry screens that do not use the
shared application header, navigation, or footer.

Rendering these screens inside AppLayout would introduce UI chrome that does
not exist in the reference design.

## Decision

Full-screen entry/flow screens will remain outside the shared AppLayout route
when their visual and interaction requirements do not include the application
shell.

The existing shopping/catalog routes will continue to use AppLayout.

## Rationale

AppLayout represents the shared application shell. Entry screens with a
different visual structure should not be forced into that shell merely for
routing convenience.

This preserves both Figma fidelity and the existing route architecture.

## Trade-off

The router contains separate route branches rather than placing every screen
under a single layout.

This is intentional and keeps route-level presentation boundaries explicit.