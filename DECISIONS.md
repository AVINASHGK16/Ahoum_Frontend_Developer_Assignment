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

## Decision 004 — Collect Delivery Location During Onboarding

### Problem

Figma Screen 6 requires the user to select a delivery Zone and Area after
mobile verification.

The application needs to decide whether location should be requested repeatedly
or collected as part of the initial onboarding flow, and where that state should
live.

### Options Considered

1. **Request location every time the application is opened**
   - Keeps the location current.
   - Creates unnecessary friction for returning users.
   - Does not match the onboarding flow represented by the Figma.

2. **Collect location once during onboarding and keep it in local component state**
   - Simple implementation.
   - Loses the selected location when the screen is unmounted.
   - Other parts of the application cannot reliably access the selected delivery location.

3. **Collect location during onboarding and store it in the existing session store**
   - Matches the onboarding flow.
   - Makes the selected location available to other application areas during the session.
   - Avoids introducing another global store.
   - Does not require backend persistence or GPS infrastructure.

### Decision

Choose **Option 3**.

The user selects their delivery Zone and Area during the onboarding flow after
verification.

The selected location is stored in the existing `sessionStore` as session-level
frontend state.

The application does not repeatedly ask for the location during the same
onboarding/session flow.

If a future Figma screen explicitly introduces address/location editing, that
flow can provide an intentional way for the user to change the selected
location.

### Rationale

Location is part of establishing the user's delivery context during onboarding,
not an action that should interrupt every application entry.

Using the existing `sessionStore` follows the established separation of
responsibilities and avoids creating unnecessary global state.

No backend persistence, GPS permissions, geolocation service, or external
location API is required because the assignment explicitly allows a frontend
implementation using mock JSON data and does not require a backend.

### Trade-off

The current implementation represents location only at the frontend session
level. It does not provide permanent account-level persistence across sessions.

This is an intentional scope decision rather than an incomplete backend
implementation.

If persistent accounts were introduced in a production version, delivery
location would be persisted as account/user data and could be changed through
an explicit address-management flow.

## Prompt 011 — Figma Screen 7: Login

### Tool / Model

Antigravity

### Objective

Implement the official Figma Screen 7/22 Login screen with high visual fidelity while preserving the established frontend architecture and mock-authentication scope.

### Prompt Given to AI

Implement the official Figma Screen 7/22: Login screen.

Treat the supplied Figma reference as the visual source of truth.

Before making changes:
- Inspect the existing project architecture.
- Inspect the router and onboarding flow.
- Inspect `sessionStore.ts` and existing user/session state.
- Reuse existing components, tokens, utilities, and architecture where appropriate.
- Do not refactor unrelated functionality.

Requirements:
- Reproduce the Figma layout, typography, spacing, colors, borders, radii and visual hierarchy closely.
- Preserve the mobile-first design.
- Provide a thoughtful constrained desktop adaptation rather than stretching the mobile screen.
- Implement email and password inputs.
- Password must be masked by default.
- Add a functional eye/eye-off control for showing and hiding the password.
- Add client-side validation for required login fields.
- Implement the "Forgot Password?" interaction without inventing unnecessary backend functionality.
- Implement the "Signup" navigation according to the existing application flow.
- Use frontend-only mock authentication.
- Do not add a backend authentication server, OAuth provider, Firebase/Auth0, password hashing infrastructure, or unnecessary dependencies.
- Use existing session state where appropriate rather than creating another global store.
- Do not store passwords as a production authentication mechanism.
- Preserve the existing folder structure.
- Do not modify unrelated catalog, cart, search, product or checkout functionality.
- Verify mobile and desktop layouts.
- Run typecheck and production build.
- Report all created/modified files and assumptions.

### Implementation Result

Created:

- `src/pages/LoginScreen.tsx`

Modified:

- `src/stores/sessionStore.ts`
- `src/app/router.tsx`

The login screen now provides:

- Nectar carrot branding.
- Figma-matched login heading and supporting text.
- Email input.
- Password input.
- Password show/hide eye interaction.
- Required-field validation.
- Forgot Password feedback interaction.
- Login CTA.
- Signup navigation.
- Frontend session/login state through the existing session store.

### Authentication Scope

Authentication remains frontend-only.

The implementation does not introduce:
- Backend authentication.
- OAuth providers.
- External authentication services.
- Additional global stores.
- Password infrastructure.

The session store now represents the authenticated frontend session required by the application flow.

### Figma / Existing Implementation Adjustments

- Added `/login` route.
- Added `/signup` navigation target.
- Extended the existing `sessionStore` rather than creating a separate authentication store.
- Preserved full-screen onboarding/auth screens outside `AppLayout`.

### Verification

- `npm run typecheck` — PASS
- `npm run build` — PASS
- Email input tested.
- Password input tested.
- Password masking tested.
- Eye visibility toggle tested.
- Empty-field validation tested.
- Login flow tested.
- Signup navigation reviewed.
- Browser console — 0 errors.
- Mobile layout reviewed.
- Desktop adaptation reviewed.

### AI Review

The authentication requirement was treated as a frontend simulation because the assignment does not require a backend authentication service.

Existing session state was extended rather than introducing another global state layer.

The implementation did not refactor unrelated application functionality.

### Human Decision

Implementation reviewed against the official Figma and accepted.

The login implementation is accepted as a frontend mock-authentication flow. No real OAuth, backend authentication, or production credential storage is required for this assignment.
