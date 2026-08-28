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

## Prompt 005 — Application Shell & Home Page Composition

### Objective
Integrate the shared application shell and implement the first functional Home Page using the existing architecture, hooks, and reusable UI components.

### Condensed Prompt
- Wire `AppLayout` into the existing React Router hierarchy.
- Implement `HomePage` using `useProducts`.
- Use existing `ProductCard` and feedback components.
- Keep pages responsible for screen composition.
- Keep components presentational.
- Do not access JSON or mock APIs directly from the page.
- Do not introduce unnecessary global state or dependencies.
- Preserve strict TypeScript, accessibility, and responsive behavior.
- Do not modify unrelated architecture, hooks, APIs, stores, or documentation.

### Implementation Result
- Integrated `AppLayout` with nested React Router routes using `<Outlet />`.
- Implemented the Home Page with product loading, success, error/retry, and empty states.
- Added responsive product presentation and category/search navigation.
- Product data is obtained through `useProducts()`.

### Review / AI Deviations
- No functional or architectural defect was identified.
- Category navigation metadata is locally defined in `HomePage` as presentation metadata rather than loading category data from the mock API.
- `AppLayout` retains an optional `children` prop in addition to `<Outlet />`; this is slightly redundant for router usage but does not currently introduce an architectural problem.

### Verification
- `npm run typecheck` — PASS
- `npm run build` — PASS
- TypeScript errors — 0
- Build errors — 0

### Commit
"feat: compose application shell and home page"

### Check / Review Prompt

Review the implementation of Task 005 against:
- ArchitectureV1.md
- DECISIONS.md
- DESIGN_NOTES.md

Inspect:
- HomePage.tsx
- AppLayout.tsx
- router.tsx

Verify that:
- HomePage obtains products through `useProducts`.
- No JSON or mock API is accessed directly by the page.
- AppLayout correctly uses React Router `<Outlet />`.
- Existing routes remain correctly nested.
- Components remain presentational.
- Zustand is not unnecessarily introduced.
- TypeScript remains strict with no `any`.
- Accessibility and responsive requirements are maintained.
- No unrelated files or architecture were modified.

Identify any AI-generated architectural mistakes, unnecessary complexity, duplicated data, or deviations from the defined architecture. Do not make changes during the review; report findings first.

### Review Findings

- No functional or architectural defect identified.
- Category navigation metadata is locally defined presentation metadata.
- Optional `children` support in `AppLayout` is slightly redundant for router-only usage but harmless.

### Corrections

None required.

### Verification

- `npm run typecheck` — PASS
- `npm run build` — PASS

## Prompt 006 — Figma Starting Screen

### Prompt
[Add the exact/minimized prompt used with Antigravity]

### Result
- Implemented the official Figma splash screen.
- Added `SplashScreen.tsx`.
- Added `/splash` outside `AppLayout`.
- Added Nectar brand color to Tailwind configuration.
- Preserved existing application architecture.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- `git status` reviewed.

### AI Review
- Previous provisional green styling was no longer sufficient for the Figma.
- Splash screen required a standalone route because it does not use application header/footer.
- No data, state, hook, API, or architecture changes were required.

### Human Decision
Accepted the implementation after reviewing the generated changes against the official Figma.

## Prompt 006 — Figma Starting Screen

### Prompt
[Add the exact/minimized prompt used with Antigravity]

### Result
- Implemented the official Figma splash screen.
- Added `SplashScreen.tsx`.
- Added `/splash` outside `AppLayout`.
- Added Nectar brand color to Tailwind configuration.
- Preserved existing application architecture.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- `git status` reviewed.

### AI Review
- Previous provisional green styling was no longer sufficient for the Figma.
- Splash screen required a standalone route because it does not use application header/footer.
- No data, state, hook, API, or architecture changes were required.

### Human Decision
Accepted the implementation after reviewing the generated changes against the official Figma.

## Prompt 007 — Figma Screen 3: Authentication Entry

Prompt:
TASK 007 — Implement Official Figma Screen 3: Nectar Authentication Entry

The official Figma is now available and is the sole visual source of truth.

Implement ONLY Figma Screen 3/22 shown in the provided design:

"Get your groceries with nectar"

Before changing anything:

1. Inspect the existing project architecture.
2. Inspect router.tsx.
3. Inspect AppLayout.tsx.
4. Inspect SplashScreen.tsx and WelcomeScreen.tsx.
5. Inspect existing types, stores, hooks, services, and pages.
6. Inspect DECISIONS.md, DESIGN_NOTES.md, and PROMPT_LOG.md.
7. Do not replace or restructure the existing architecture.
8. Identify whether any existing authentication/session implementation can
   support this screen before introducing new state or services.

FIGMA SCREEN 3 REQUIREMENTS

Implement the screen to closely reproduce the official Figma reference:

- Mobile-first full-screen authentication entry screen.
- Top grocery/produce photographic image matching the Figma composition.
- Large white/empty visual area beneath the image as shown in the reference.
- Heading:
  "Get your groceries
   with nectar"
- Mobile number/country-code input row.
- Country indicator/icon.
- Country code "+880".
- Appropriate divider beneath the mobile number area.
- Centered text:
  "Or connect with social media"
- Google authentication button:
  "Continue with Google"
- Facebook authentication button:
  "Continue with Facebook"
- Match the Figma's typography hierarchy, spacing, sizing, borders,
  button dimensions, radii, alignment, and visual proportions.
- Preserve the Figma's clean minimal appearance.
- Do not add UI elements that are not present in the reference.
- Do not add bottom navigation or AppLayout header/footer to this screen.

ASSET HANDLING

Use the official Figma visual reference.

For the grocery photograph:

1. First determine whether the exact image asset already exists in the
   project or can be extracted/used from the provided design.
2. Prefer an actual local asset when available.
3. Do NOT invent a different composition merely because it is convenient.
4. If the exact Figma asset cannot be obtained, use the closest available
   local implementation and explicitly report that limitation.
5. Do not claim a generated image is the original Figma asset.

ROUTING

- Add the appropriate route for Screen 3.
- Keep this screen outside AppLayout because it is part of the authentication/
  onboarding flow.
- Update the Screen 2 "Get Started" action to enter this authentication screen
  instead of going directly to the catalog.
- Preserve the existing Splash → Welcome sequence.

Expected flow:

/splash
   ↓
/welcome
   ↓
/auth (Screen 3)


For the Google and Facebook buttons, implement only the UI and interaction
required by Screen 3 unless an existing authentication mechanism already exists.
Do not pretend OAuth is functional if no OAuth integration exists.

TECHNICAL REQUIREMENTS

- Strict TypeScript.
- No `any`.
- Reuse existing design primitives/components where appropriate.
- Keep screen-specific presentation inside the appropriate page/component
  boundary.
- Keep reusable UI components reusable rather than duplicating them.
- Maintain accessibility:
  - semantic buttons/inputs
  - accessible labels
  - keyboard interaction
  - visible focus states where appropriate
- Do not sacrifice visual fidelity for unnecessary abstraction.

RESPONSIVE BEHAVIOUR

The Figma is mobile-first.

Match the reference viewport first.

Then provide sensible responsive behaviour for larger screens without
turning the mobile design into a stretched desktop layout.

VERIFICATION

After implementation run:

npm run typecheck
npm run build

Then run the application and verify in the browser:

1. /splash
2. Splash → Welcome
3. Welcome → Screen 3
4. Screen 3 visual layout
5. mobile input interaction
6. Google/Facebook button interaction if implemented
7. browser console for errors

Report:

- exact files created
- exact files modified
- assets added
- route changes
- whether any existing architecture changed
- any Figma asset limitations
- typecheck result
- build result
- browser verification result
- any assumptions made

Do not modify documentation or commit anything in this task unless explicitly
asked after the implementation has been reviewed. 
### Result
- Implemented the official Figma authentication entry screen.
- Added the grocery flat-lay header asset.
- Added mobile-number entry UI using the `+880` country code shown in the Figma.
- Added Google and Facebook social authentication UI.
- Connected the screen to the onboarding flow.

### Scope
- Social authentication is implemented as a frontend mock interaction.
- No OAuth provider or backend authentication API was introduced because real authentication is outside the assignment scope.
- Multi-region phone-number selection/validation was not introduced because the provided Figma specifies `+880` and does not require an international phone system.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Browser flow verified.

### Human Review
- Reviewed the implementation against Figma Screen 3.
- Accepted the implementation.

## Prompt 008 — Figma Screen 4: Mobile Number Entry

### Objective
Implement Figma Screen 4, "Enter your mobile number", and connect it correctly to the existing onboarding flow.

### Prompt
Implement Screen 4 from the provided Figma reference. Match the mobile-first layout, typography, spacing, Bangladesh flag, +880 country code, mobile number input, back navigation, and green circular continue button. Connect the screen to the previous authentication screen. Use native mobile input behavior (`type="tel"` and `inputMode="numeric"`), do not create a custom keyboard, and do not add backend/OTP/authentication services. Preserve the existing architecture and only modify files required for this screen.
### Continue button
The green circular arrow is the primary continuation control.
For this assignment, implement only frontend navigation behavior.
Do not make API/authentication calls.
Do not invent OTP verification.
If the next Figma screen has not yet been implemented, keep the navigation target deliberately isolated/easy to update rather than implementing future screens prematurely.

### Back button

The top-left back arrow should return the user to `/auth`.

### Result
- Created `PhoneNumberScreen.tsx`.
- Added `/phone` route.
- Connected the mobile-number entry on `AuthScreen` to `/phone`.
- Added back navigation to `/auth`.
- Added native telephone input with numeric mobile input mode.
- Added autofocus behavior.
- Added Figma-matching green circular continue button.
- Preserved existing API, Zustand, data, and application architecture.

### AI Review
- No backend authentication or OTP implementation was introduced.
- No custom keyboard was introduced; the Figma keyboard represents native mobile OS behavior.
- Desktop responsive DevTools cannot display the native mobile keyboard, but the input is configured to invoke it on supported mobile devices.
- `min-h-[100dvh]` and scroll handling were added to remain usable when the native keyboard reduces the viewport.
- No unrelated architectural changes were identified.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Browser flow `/auth` → `/phone` verified.
- Phone input accepts numeric input.
- Back navigation verified.
- Continue action verified.
- No browser console errors.

### Human Decision
Accepted after reviewing the implementation against the official Figma reference.

## Prompt 009 — Figma Screen 5: 4-Digit Verification Code

### Objective

Implement the official Figma Screen 5, "Enter your 4-digit code", following the existing mobile-first onboarding flow while preserving the established project architecture.

### Prompt

Implement Screen 5/22 from the provided official Figma.

Connect Screen 4 mobile-number entry to this verification-code screen.

Match the Figma's:
- mobile-first layout
- typography hierarchy
- spacing
- back navigation
- "Enter your 4-digit code" heading
- "Code" label
- four-digit code entry
- masked/revealed code interaction
- eye show/hide control
- "Resend Code" action
- green circular continue button

Use a real accessible input with native mobile numeric input behavior. Do not recreate the mobile OS keyboard as a React component.

Restrict the verification code to four numeric digits.

Implement show/hide behavior for the entered code using an accessible eye control.

Keep resend behavior frontend-only. Do not introduce real OTP, SMS, authentication APIs, or unnecessary dependencies.

Preserve the existing project architecture, folder structure, state management, mock API boundaries, and unrelated implementations.

The application must remain responsive: use the Figma as the mobile reference while providing a thoughtful desktop adaptation rather than stretching the mobile layout.

Do not assume that completing Screen 5 means entering the catalog. Connect the continue action to the correct subsequent Figma screen.

### Result

- Created `src/pages/VerificationScreen.tsx`.
- Added `/verification` route.
- Connected Screen 4 continue action to Screen 5.
- Added four-digit numeric code input.
- Added numeric sanitization and `maxLength={4}`.
- Added automatic input focus.
- Added functional show/hide code control.
- Added frontend-only resend-code interaction.
- Added back navigation to Screen 4.
- Added Figma-style green circular continue control.
- Preserved existing application architecture and unrelated features.

### Verification

- `npm run typecheck` → PASS
- `npm run build` → PASS
- Screen 4 → Screen 5 navigation verified.
- Automatic input focus verified.
- Four-digit numeric entry verified.
- Non-numeric input restriction verified.
- Show/hide code interaction verified.
- Resend interaction verified.
- Back navigation verified.
- Continue interaction verified.
- Browser console → 0 errors.

### AI Review

- Native mobile keyboard is intentionally not recreated.
- `inputMode="numeric"` allows supported mobile browsers to invoke the native numeric keyboard.
- No backend OTP/SMS/authentication infrastructure was introduced.
- Existing architecture and application boundaries were preserved.
- Desktop responsive behavior remains separate from native mobile keyboard behavior.

### Human Review

Implementation reviewed against the official Figma reference and Accepted.

## Prompt 010 — Figma Screen 6: Select Your Location

### Tool / Model

Antigravity

### Objective

Implement official Figma Screen 6/22, "Select Your Location", while preserving the established frontend architecture and onboarding flow.

### Prompt Given to AI

Implement Figma Screen 6: Select Your Location.

Before changing code, inspect the existing onboarding flow, sessionStore, router, and relevant types.

Requirements:

- Match the provided Figma screen closely on mobile.
- Treat the official Figma as the visual source of truth.
- Preserve the existing architecture and folder structure.
- Keep the screen outside AppLayout because it is part of the full-screen onboarding flow.
- Add a back action returning to the verification screen.
- Implement Zone selection and Area selection.
- Area options must depend on the selected Zone.
- Use the existing sessionStore for the selected delivery location because this is session-level user state.
- Do not create a separate location store unless the existing architecture genuinely requires one.
- Do not add GPS, browser geolocation permissions, external location APIs, backend APIs, or unnecessary dependencies.
- Add the Submit interaction and continue to the main application.
- Support mobile-first behavior and provide a sensible desktop adaptation.
- Preserve strict TypeScript and accessibility.
- Do not modify unrelated features or architecture.
- Run typecheck and production build.
- Report every file created or modified and any assumptions made.

### Implementation Result

Created:

- `src/pages/LocationScreen.tsx`
- `public/images/location-map.jpg`

Modified:

- `src/stores/sessionStore.ts`
- `src/pages/VerificationScreen.tsx`
- `src/app/router.tsx`

The screen now supports:

- Back navigation to verification.
- Zone selection.
- Area selection dependent on the selected Zone.
- Delivery location stored in `sessionStore`.
- Submit action entering the main application.
- Mobile-first layout with desktop adaptation.
- Figma-derived location illustration and visual hierarchy.

### What AI Got Wrong / What I Corrected

- The implementation uses session-level state rather than introducing persistent account/location infrastructure. This is intentional because the assignment requires a frontend application with mock data and no backend.
- The location flow was reviewed as an onboarding step rather than a location prompt that should appear repeatedly. The user should not be forced to select a location every time they enter the application during the same onboarding/session flow.
- No GPS or external location service was introduced because it would add functionality that the assignment does not require.

### Verification

- `npm run typecheck` — PASS
- `npm run build` — PASS
- Zone selection tested.
- Area dependency tested.
- Back navigation tested.
- Submit navigation tested.
- Location state integration reviewed.
- Browser flow `/verification → /location → /` tested.
- 0 browser console errors.

### AI Review

The implementation remained within the existing architecture.

No new global store was introduced.

The location state was placed in the existing `sessionStore`, which is the appropriate owner for session-level user information.

The full-screen onboarding route remains outside `AppLayout`.

### Human Decision

Implementation reviewed and accepted against the official Figma.

The location screen is accepted as an onboarding step and the current frontend scope does not require repeated location selection, GPS, or backend persistence.

### Status

Completed and reviewed.

## Prompt 010 — Figma Screen 8: Signup

### Prompt
Implement Figma Screen 8/22 — Signup screen as a responsive React page matching the provided Figma reference exactly. Connect it from the Login screen's Signup link, provide username/email/password fields, password visibility toggle, frontend-only validation and mock signup behavior using the existing session architecture/localStorage where appropriate. Preserve existing architecture and implement mobile-first responsive behavior with proper desktop support.

### Result
- Implemented `SignupScreen.tsx`.
- Added the real `/signup` route instead of the previous `/auth` alias.
- Connected Login → Signup.
- Connected "Already have an account? Login" → `/login`.
- Added username, email, and password fields.
- Added password show/hide toggle.
- Added frontend-only validation.
- Added mock signup/session behavior without introducing a backend.
- Matched the Figma typography, spacing, colors, input styling, button styling and responsive layout.
- Corrected CTA text from `Sing Up` to `Sign Up`.
- Corrected bottom navigation text from `Already have an account? Signup` to `Already have an account? Login`.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Login → Signup navigation → PASS
- Signup → Login navigation → PASS
- Password visibility toggle → PASS
- Form validation → PASS
- Browser console → 0 errors

### AI Review
- Signup is a separate authentication entry screen and must not reuse `/auth`.
- No backend/OAuth implementation was required because this assignment is frontend-focused.
- Existing session architecture was reused rather than introducing another authentication store.

### Human Decision
Reviewed the implementation against the Figma reference and manually verified the Signup flow and interactions. Accepted the implementation after correcting the account-navigation copy and CTA spelling.

## Prompt 010 — Figma Screen 12: Home / Shop Page

### Prompt
Implement Figma Screen 12/22 — Home / Shop page from the provided Figma reference.

Requirements:
- Treat the Figma as the visual source of truth.
- Implement mobile-first first, matching the reference layout, typography, spacing, colors, borders, radii, icons, product cards, banner, and bottom navigation as closely as possible.
- Display the selected delivery location from the existing session state.
- Implement the Search Store field.
- Implement the Fresh Vegetables promotional banner.
- Implement Exclusive Offer and Best Selling horizontal product sections.
- Implement functional product `+` buttons using the existing cart state.
- Implement the five-item bottom navigation: Shop, Explore, Cart, Favourite, Account.
- Keep Explore, Favourite, and Account screens as existing/future routes only; do not implement their Figma screens yet.
- Preserve the existing application architecture and APIs.
- Do not introduce unnecessary dependencies or backend changes.
- After mobile fidelity is complete, provide a thoughtful responsive desktop/tablet adaptation rather than stretching the mobile layout.
- Use local assets rather than runtime external image dependencies.
- Run typecheck and production build.
- Verify the resulting screen in both mobile and desktop browser viewports.

### Result
- Implemented Figma Screen 12/22 Home / Shop page.
- Added responsive Home page composition.
- Added product cards and horizontal mobile product sections.
- Added persistent five-item bottom navigation.
- Connected product `+` buttons to existing cart state.
- Connected Home location display to `sessionStore`.
- Added local promotional and product image assets.
- Preserved existing Explore, Favourite, and Account routes without implementing their future Figma screens.
- Added responsive desktop/tablet adaptation.

### Files Created
- `src/components/layout/BottomNav.tsx`
- `public/images/banner-fresh-vegetables.jpg`
- `public/images/product-bananas.jpg`
- `public/images/product-apple.jpg`
- `public/images/product-bell-pepper.jpg`
- `public/images/product-ginger.jpg`

### Files Modified
- `src/pages/HomePage.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/stores/cartStore.ts`
- `src/types/product.ts`
- `src/data/products.json`

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Browser verification → PASS
- Mobile viewport → PASS
- Desktop viewport → PASS
- Console errors → 0

### AI Review
- Home screen was implemented from the official Figma reference rather than treating the previous temporary desktop shell as the visual source of truth.
- Mobile layout uses horizontal product carousels and persistent bottom navigation.
- Desktop/tablet layout uses an intentional responsive adaptation.
- Existing application architecture and mock API layer were preserved.
- Future Explore, Favourite, and Account Figma screens were intentionally left for their respective implementation phases.

### Human Decision
Accepted the Home / Shop implementation after manually testing the mobile-first flow and confirming the screen and interactions behave correctly.