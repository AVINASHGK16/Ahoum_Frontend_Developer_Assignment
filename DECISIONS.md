🧠 Ahoum Grocery App — Engineering Decisions

This document records the non-trivial engineering and architecture decisions
made during development of the Ahoum Grocery App.

It intentionally does not reproduce individual AI prompts or implementation
logs. The purpose of this document is to explain what was decided, why it
was decided, what alternatives were considered, and what trade-offs were
accepted.

Decision 001 — Use the Official Figma as the Visual Source of Truth

Context

The project initially used a documented provisional visual system because the
official Figma reference was not available at the beginning of implementation.

The official Figma subsequently became available.

Options Considered

Rebuild the entire application around the Figma.

Continue treating the provisional visual system as authoritative.

Adopt the official Figma for presentation while preserving stable application
architecture.

Decision

Choose Option 3.

The official Figma is the primary visual reference for UI implementation.

Existing data access, state management, hooks, routing, and application
boundaries are preserved unless the Figma introduces a genuine functional
requirement.

Rationale

The presentation layer can be adapted without throwing away working
application architecture.

This avoids unnecessary rewrites while allowing the implementation to converge
toward the supplied design.

Trade-off

Some existing UI components may need visual changes. This is accepted because
visual fidelity is a presentation concern and does not justify rebuilding
stable application foundations.

Decision 002 — Separate Presentation, Data Access, and Shared State

Context

The application contains pages, reusable UI components, asynchronous search,
mock API/data access, cart and favourite state, and session information.

Keeping all of this logic inside page components would create unnecessary
coupling.

Options Considered

Option

Benefit

Problem

Page-level API/state logic

Simple initially

High coupling and harder debugging

One global store for everything

Centralized

Unnecessary global state

Separate presentation, data access, hooks, and shared state

Clear ownership

More project structure

Decision

Use separated responsibilities.

The intended boundary is:

Pages / Components
        │
        ├── Hooks / Application Logic
        │
        └── Zustand Stores
                │
                ↓
             Mock API
                │
                ↓
            Static Data

Rationale

Each layer has a clear responsibility:

Components render and handle UI interaction.

Hooks contain reusable application behavior.

Stores own genuinely shared client state.

The mock API/data layer isolates data access from presentation.

Trade-off

There are more files and boundaries than a page-only implementation, but the
result is easier to maintain and reason about.

Decision 003 — Keep Full-Screen Entry Flows Outside AppLayout

Context

The onboarding/authentication screens do not use the same application shell as
the shopping experience.

Forcing them inside the shared layout would add navigation/header elements that
do not belong to those screens.

Decision

Full-screen entry and authentication flows remain outside the shared
AppLayout when their design does not require the application shell.

Shopping/catalog routes continue to use the shared application layout.

Rationale

AppLayout represents the authenticated/main application shell. Entry flows
have a different presentation boundary and should remain independent.

Trade-off

The route structure has separate branches instead of placing every screen
under one universal layout. This is intentional.

Decision 004 — Store Delivery Location in Existing Session State

Context

The onboarding flow requires the user to select a delivery Zone and Area.

The application needs this information later on the Shop/Home experience.

Options Considered

Ask for location repeatedly.

Keep location only in the onboarding component.

Store the selected location in the existing session store.

Decision

Choose Option 3.

The selected delivery Zone and Area are stored as session-level frontend state
using the existing sessionStore.

The Shop/Home experience reads the selected location from that state.

Rationale

Location establishes the user's delivery context during onboarding and should
remain available to other application areas during the session.

Using the existing session store avoids introducing another global store.

Scope

The assignment does not require GPS, a geolocation service, backend location
persistence, or an external location API.

Trade-off

The current implementation is session-level rather than permanent account-level
address storage.

A production system would persist delivery addresses as user/account data and
provide explicit address management.

Decision 005 — Extend Existing Session State for Frontend Authentication

Context

The Login screen needs to communicate successful authentication to the rest
of the frontend.

Creating a second authentication state source would duplicate session
responsibility.

Options Considered

Create a dedicated authentication store.

Keep authentication state entirely inside the Login page.

Extend the existing sessionStore.

Decision

Choose Option 3.

The existing sessionStore owns the frontend session/authentication state
required by the assignment.

The Login screen owns form presentation and interaction; the session store owns
the resulting session state.

Scope Limitation

Authentication remains a frontend mock flow.

The implementation does not introduce:

Backend authentication

OAuth providers

External authentication services

Password hashing infrastructure

Production credential persistence

Rationale

This satisfies the assignment's frontend scope without introducing an
unnecessary backend authentication architecture.

Trade-off

The flow does not provide real identity verification.

That is an intentional assignment-scope limitation, not an attempt to present
mock authentication as production authentication.

Decision 006 — Protect Search State from Stale Async Responses

Context

Rapid search requests can complete out of order.

Example:

Request A: "milk"  → 1200ms
Request B: "apple" → 200ms

B completes first.
A completes later.

Without protection, the older "milk" response could overwrite the newer
"apple" results.

Options Considered

Strategy

Result

Debouncing only

Reduces request frequency but does not eliminate response races

Timestamp tagging

Can reject older results but leaves requests running

AbortController + request token guard

Cancels pending work and validates the response before committing

Decision

Use AbortController together with an active request identifier.

The search store:

Creates a unique request ID.

Aborts the previous request when stale protection is enabled.

Associates the current request with the active ID.

Validates the response request ID before updating results.

Records request outcomes for debugging.

Rationale

Cancellation and response validation solve different parts of the problem:

AbortController stops obsolete in-flight work where possible.

The request ID guard prevents a stale response from committing even if it
reaches the application.

Verification

The application includes a stale-search debugging flow capable of exercising
artificial latency and demonstrating the race condition.

Trade-off

The store requires additional request lifecycle management, but the complexity
is justified by deterministic search behavior.

Decision 007 — Validate Persisted Cart Against the Current Catalog

Context

Cart state is persisted in browser storage.

The catalog can change between sessions:

A product can disappear.

A price can change.

Available stock can become lower than the saved quantity.

A naive cart can therefore contain invalid or outdated information.

Options Considered

Strategy

Problem

Clear the entire cart

Loses valid customer selections

Silently update prices

Can surprise the customer at checkout

Validate and synchronize against the current catalog

Preserves valid state and communicates changes

Decision

Validate persisted cart items against the current product catalog when the
cart is synchronized.

The synchronization process:

Removes products that no longer exist.

Updates product information from the current catalog.

Detects price changes.

Caps quantities when stock is lower than the saved quantity.

Records user-facing resilience warnings.

Rationale

The cart should be resilient without silently hiding catalog changes from the
customer.

Valid items are preserved instead of resetting the entire cart.

Trade-off

Cart synchronization adds validation logic, but it prevents stale persisted
state from producing incorrect totals or broken checkout behavior.

Decision 008 — Use Draft and Applied Filter State

Context

The filter drawer contains multiple selections across product categories and
brands.

Applying each checkbox immediately would make it difficult for a user to build
a complete filter selection before committing it.

Decision

Use two filter states:

draftFilters
     │
     │ user checks/unchecks
     ↓
Filter Sheet
     │
     │ Apply Filter
     ↓
appliedFilters
     │
     ↓
Product Results

draftFilters represents the user's current selections inside the drawer.

appliedFilters represents the criteria actually used by the product results.

Rationale

Users can change multiple selections and commit them with one explicit action.

This also prevents accidental partial filter application.

Trade-off

Two states are slightly more complex than one, but the distinction provides a
clear and predictable filter lifecycle.

Decision 009 — Categories and Brands Are Separate Filter Dimensions

Context

The filter experience needs to distinguish product categories from product
brands.

Treating them as one generic list would make the filter model ambiguous.

Decision

Maintain separate filter groups:

Filters
├── Categories
│   ├── Eggs
│   ├── Noodles & Pasta
│   ├── Chips & Crisps
│   └── Fast Food
│
└── Brands
    ├── Individual Collection
    ├── Cocola
    ├── Ifad
    └── Kazi Farmas

The product result is computed from the applied category and brand criteria.

Rationale

Category and brand answer different product-discovery questions and should
remain independently understandable to the user.

Trade-off

The filtering model contains more explicit fields, but it makes the behavior
and UI much clearer.

Decision 010 — Reuse the Shared Filter Flow from Explore

Context

Explore is a primary product-discovery surface.

The application already has category/brand filtering functionality, but the
Explore screen also needs access to it.

Options Considered

Build a separate Explore filter.

Duplicate the filtering logic.

Reuse the existing Filter component/state.

Decision

Choose Option 3.

Explore exposes the existing filtering capability instead of introducing a
second filter implementation.

Rationale

The same category/brand selection should produce the same product results
regardless of where the user enters the filtering flow.

Trade-off

Explore depends on the shared filter flow, but this is preferable to duplicated
logic that could drift between screens.

Decision 011 — Account Navigation Is Authentication-State Aware

Context

The Account navigation item was previously capable of taking the user back to
the Login/Signup experience.

That is incorrect once the user is already authenticated.

Options Considered

Always open Login/Signup.

Always open Account.

Choose the destination from the current authentication state.

Decision

Use state-aware Account navigation.

Authenticated
     ↓
Account / Profile

Unauthenticated
     ↓
Login / Signup

The Account experience reuses existing session information and existing cart
state where relevant.

Rationale

Authentication and account access are related but are not the same destination.

An authenticated customer should be able to inspect their account without
restarting the authentication flow.

Constraint

Do not introduce a second user/authentication state source.

Decision 012 — Use a Shared Modal / Bottom-Sheet Container

Context

Checkout, location selection, authentication-related dialogs, filters, and
order-result interactions require common overlay behavior.

Implementing each overlay independently would duplicate:

Backdrop handling

Dismissal behavior

Viewport sizing

Animation behavior

Keyboard/Escape handling

Decision

Use a shared BottomSheet container with configurable width variants.

The component adapts between:

Mobile
→ full-width / bottom-sheet presentation

Larger screens
→ centered dialog-card presentation

Rationale

Shared modal infrastructure keeps overlay behavior consistent and prevents
small differences from appearing between dialogs.

Trade-off

The shared component must support multiple presentation modes, but this is
less duplication than maintaining separate modal systems.

Decision 013 — Adapt Checkout Presentation for Desktop

Context

A mobile bottom sheet does not translate directly into a comfortable desktop
checkout experience.

A narrow modal also caused avoidable vertical scrolling.

Decision

Use:

Bottom-sheet presentation on mobile.

A wider centered card on larger screens.

Expanded spacing and hierarchy on desktop.

A scroll-free desktop checkout layout where the available viewport permits
the complete checkout content to fit.

Rationale

Desktop checkout should feel like a focused web checkout rather than a mobile
sheet stretched onto a large monitor.

Trade-off

Desktop requires a separate responsive presentation strategy, but the underlying
checkout state and behavior remain shared.

Decision 014 — Keep Favourite and Cart as Independent Concepts

Context

A product can be saved for later without necessarily being purchased.

Combining Favourite and Cart state would make these actions ambiguous.

Decision

Favourite state and Cart state remain independent.

Favourite
→ Saved product

Cart
→ Product selected for purchase

Favourite actions do not automatically add products to the Cart.

An explicit Add-to-Cart action is required.

Rationale

This matches standard ecommerce interaction semantics and prevents accidental
purchases from a save-for-later action.

Decision 015 — Make Quantity Visible on Product Cards After Adding

Context

The Add button initially showed only +.

After repeated additions, the customer could not immediately tell how many units
had been selected without opening the Cart.

Decision

Once a product exists in the Cart, the compact product-card control can expose
quantity through increment/decrement interaction.

Not in cart:

        [+]


In cart:

      [-]  2  [+]

Rationale

The user receives immediate feedback about cart quantity at the point of
interaction.

Trade-off

The card control becomes slightly wider after the first addition, but the
additional information reduces uncertainty and unnecessary navigation.

Decision 016 — Preserve Existing Assets During Unrelated Changes

Context

AI-assisted UI changes can unintentionally modify image paths, object
positioning, or image sizing while implementing unrelated functionality.

The Welcome screen demonstrated how responsive image framing can significantly
change the perceived composition.

Decision

Existing product, category, banner, and application assets are treated as
protected unless an image change is explicitly requested.

Responsive fixes should prefer:

CSS layout changes

Object positioning

Container constraints

Responsive sizing

rather than replacing working assets.

Rationale

Changing unrelated assets increases regression risk and makes visual debugging
harder.

Trade-off

Some responsive image problems require careful CSS composition rather than a
quick asset replacement.

🧪 Decision Validation Principles

Technical decisions are not considered complete merely because the application
builds.

For significant changes, validation includes the relevant combination of:

TypeScript/typecheck

Production build

Browser interaction testing

Responsive viewport testing

Console-error review

Visual comparison against the Figma

State-transition testing

Edge-case testing

Manual regression testing of unrelated flows

AI-generated implementation is treated as an implementation proposal; the final
decision remains subject to application behavior and human review.

📌 Architectural Constraints

The following constraints apply across the project:

Do not introduce a second global state source when an existing store already
owns the responsibility.

Do not duplicate filtering, cart, favourite, or session logic between
screens.

Do not modify unrelated functionality while implementing a scoped feature.

Do not replace working assets unless the requirement explicitly calls for an
asset change.

Do not treat a successful build as proof that UX behavior is correct.

Keep frontend mock functionality clearly separated from production-grade
infrastructure that is outside the assignment scope.

Prefer explicit state ownership over implicit page-local synchronization.

Preserve stable architecture while adapting presentation to the official
Figma.

🏁 Final Position

The Ahoum frontend deliberately favors clear ownership, reusable state
boundaries, resilient client behavior, and Figma-driven presentation over
short-term implementation shortcuts.

The decisions in this document describe the final architectural direction.
Detailed AI prompts, mistakes, corrections, and execution history belong in
PROMPT_LOG.md; visual and responsive reasoning belongs in
DESIGN_NOTES.md; debugging evidence belongs in DEBUGGING.md.