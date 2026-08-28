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

## Prompt 011 — Figma Screen 13: Product Information / Detail Page

### Prompt
Implement Figma Screen 13/22 — Product Information / Product Detail page.

Use the provided Figma reference as the visual source of truth. Implement mobile-first first, matching the reference's layout, typography, spacing, colors, borders, radii, icons, product image area, quantity controls, price, product details, nutrition, reviews, favourite control, share control, and Add To Basket CTA.

Connect the Home / Shop product cards so clicking a product opens a dynamic `/product/:productId` route.

Reuse the existing Product type, product data, product API/mock layer, cartStore, sessionStore, AppLayout, and routing architecture.

The product detail page must be driven by the selected product ID and must not hardcode Red Apple.

Implement:
- Back navigation
- Dynamic product information
- Product image
- Favourite toggle
- Share interaction with graceful browser fallback
- Quantity +/- controls with minimum quantity of 1
- Dynamic total price
- Product Detail section
- Nutrition row
- Review/rating row
- Add To Basket using the existing cartStore
- Reactive cart badge update
- Safe invalid-product handling

The Home page's green `+` button must remain a quick-add action and must not accidentally navigate to the product page.

Do not add backend APIs, authentication changes, database changes, duplicate stores, unnecessary dependencies, or future Figma screens.

Implement mobile-first and then provide a thoughtful tablet/desktop responsive adaptation rather than simply stretching the mobile layout.

Run typecheck and production build and verify the complete Home → Product Detail flow in the browser.

### Result
- Implemented Figma Screen 13/22 Product Information / Detail page.
- Added dynamic `/product/:productId` product detail rendering.
- Connected Home product cards to the product detail page.
- Added quantity controls and dynamic pricing.
- Connected Add To Basket to the existing cartStore.
- Added favourite interaction.
- Added browser share with fallback behavior.
- Added product-detail error handling.
- Preserved the existing application architecture.
- Added responsive mobile/tablet/desktop adaptation.

### Files Created
- None.

### Files Modified
- `src/pages/ProductDetailPage.tsx`
- `src/stores/cartStore.ts`
- `src/stores/sessionStore.ts`

### Route
- `/product/:productId`

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Home → Product Detail → PASS
- Dynamic product rendering → PASS
- Back navigation → PASS
- Quantity +/- → PASS
- Minimum quantity of 1 → PASS
- Favourite toggle → PASS
- Share interaction → PASS
- Add To Basket → PASS
- Cart badge update → PASS
- Invalid product handling → PASS
- Browser console errors → 0

### AI Review
- Product detail uses the existing product and cart architecture instead of introducing duplicate state or APIs.
- Product cards retain their quick-add behavior while the card itself opens the product detail page.
- Static nutrition/review presentation was kept limited to the information required by Screen 13.
- Desktop/tablet behavior was treated as a responsive adaptation rather than a stretched mobile layout.

### Human Decision
Accepted the implementation after manually testing the Product Detail screen and confirming navigation, quantity controls, favourite, back navigation, and Add To Basket behavior.

## Prompt 012 — Figma Screen 16: Search Results / Product Search

Implemented the Figma Screen 16/22 Search Results experience.

### Requirements
- Implement the search results screen based on the Figma reference.
- Search products dynamically based on the entered query.
- Search must support `/search?q=Egg`.
- Display matching products in the same reusable product-card style used throughout the application.
- Include search input, clear button, and filter action.
- Product results must remain connected to the existing product catalog.
- Clicking a product must navigate to the existing dynamic product detail route.
- Preserve the existing Home, Explore, Category, Product Detail, Cart, Session, and navigation functionality.
- Mobile-first implementation, with responsive behavior for larger screens.

### Implementation
- Implemented dynamic search filtering in `SearchPage.tsx`.
- Added URL query synchronization using the search query parameter.
- Added clear-search interaction.
- Added empty-search/no-results handling.
- Added the required Figma Screen 16 egg products to the catalog.
- Added/ restored local product image assets required by the search results.
- Reused the existing `ProductCard` and product-detail flow.
- Preserved the existing application architecture and routing.

### Regression Fix
During Search implementation, existing Home/Explore product images were temporarily broken because the product catalog/image mappings were altered.

The regression was fixed by restoring the correct existing image references while retaining the newly added search products.

Verified that:
- Home product images load correctly.
- Home promotional banner loads correctly.
- Explore category images load correctly.
- Category product images load correctly.
- Search product images load correctly.
- Existing product-detail navigation remains functional.

### Verification
- `npm run typecheck` — PASS
- `npm run build` — PASS
- Search query `Egg` — PASS
- Egg result images — PASS
- Existing catalog images — PASS
- Product → Product Detail navigation — PASS
- No unrelated architecture changes made.

### Current Status
Figma Screens 12–16 implemented:
- Screen 12 — Home / Shop
- Screen 13 — Product Information
- Screen 14 — Explore / Find Products
- Screen 15 — Category Product Listing
- Screen 16 — Search Results

## Prompt 013 — Figma Screens 17–19: Cart, Checkout & Order Confirmation Flow

### Prompt
Implement the Figma Cart and Checkout flow while preserving all previously completed Home, Product Detail, Explore, Category, and Search functionality.

Use the provided Figma references as the visual source of truth.

Implement the Cart page first, followed by the Checkout page and the Order Confirmation / Checkout Result page.

The flow must be fully connected to the existing global cart state so products added from any existing product-discovery screen remain available when the user opens Cart.

Products added from:
- Home / Shop
- Product Detail
- Explore → Category
- Search Results

must all use the existing cartStore and appear correctly in the Cart page.

### Cart Requirements

Implement the Figma Cart screen with:

- "My Cart" header
- Product image
- Product name
- Product unit
- Remove `X` action
- Quantity decrement `-`
- Current quantity
- Quantity increment `+`
- Dynamic line-item price
- Dynamic overall cart total
- "Go to Checkout" CTA
- Total price displayed inside the checkout CTA
- Empty-cart state with appropriate shopping action
- Existing BottomNav with reactive Cart badge

Cart behavior must:
- Preserve products added from all existing pages
- Merge duplicate additions of the same product into its quantity
- Increase/decrease quantity correctly
- Prevent quantity from becoming less than 1 through the quantity controls
- Remove products through the `X` action
- Recalculate line totals immediately
- Recalculate the overall cart total immediately
- Keep the BottomNav Cart badge synchronized with the actual cart state

### Checkout Requirements

Create a dedicated `/checkout` page connected to the existing cart state.

Implement:
- Delivery/location summary using the existing sessionStore
- Order item summary
- Quantities
- Item prices
- Overall order total
- Payment method selection
- Cash on Delivery
- Credit/Debit Card
- Mobile Banking
- "Place Order" CTA

Payment is a simulated frontend interaction only.

Do not introduce a real payment gateway, backend payment API, authentication changes, database changes, or unnecessary dependencies.

The checkout page must use the current cart contents and must not use hardcoded order data.

### Order Confirmation Requirements

Implement the Figma order confirmation/result screen with:
- Success checkmark visual
- "Your Order has been accepted"
- Supporting confirmation text
- "Track Order" CTA
- "Back to Home" navigation

When the order is successfully placed:
- Clear the active cart
- Navigate to the checkout result page
- Ensure the Cart badge updates accordingly

### Architecture Constraints

Reuse the existing:
- `Product` type
- `products.json`
- Product API/mock layer
- `useCartStore`
- `useSessionStore`
- `AppLayout`
- BottomNav
- Existing router

Do not:
- Create a second cart store
- Duplicate product/cart state
- Modify product image assets or image paths
- Replace existing image assets
- Modify Home, Product Detail, Explore, Category, or Search visual implementations unnecessarily
- Change authentication architecture
- Add backend APIs
- Add database changes
- Add real payment processing
- Implement future Figma screens
- Refactor unrelated working functionality

The previously implemented product images and image paths must remain untouched.

Implement mobile-first using the provided Figma references and then provide sensible tablet/desktop responsive behavior without simply stretching the mobile design.

### Verification Requirements

Run:
- `npm run typecheck`
- `npm run build`

Then verify in the browser:

1. Home → Add product → Cart
2. Search → Add product → Cart
3. Explore → Category → Add product → Cart
4. Product Detail → Select quantity → Add To Basket → Cart
5. Multiple additions of the same product merge correctly
6. Cart `+` / `-` quantity controls
7. Cart item removal
8. Dynamic line-item totals
9. Dynamic overall total
10. Cart badge synchronization
11. Empty cart behavior
12. Cart → Checkout
13. Checkout item and price accuracy
14. Payment method selection
15. Place Order
16. Cart clearing after successful order
17. Checkout Result screen
18. Back to Home
19. Verify existing product images remain functional
20. Verify browser console contains no errors

Do not consider the implementation complete unless typecheck, production build, and browser verification all pass.

### Result
- Implemented Figma Cart screen and connected it to the existing global cart state.
- Added dynamic cart item rendering using catalog product data.
- Added quantity increment/decrement controls.
- Added product removal functionality.
- Added dynamic line-item and overall cart totals.
- Added empty-cart state.
- Connected Cart badge to the actual global cart quantity.
- Implemented dedicated `/checkout` page.
- Added delivery/location summary using existing session state.
- Added order review and dynamic pricing.
- Added simulated Cash on Delivery, Credit/Debit Card, and Mobile Banking payment selection.
- Implemented Place Order interaction.
- Implemented `/checkout/result` order confirmation screen.
- Successful checkout clears the cart and navigates to the confirmation screen.
- Preserved existing product image assets and paths.
- Preserved existing Home, Product Detail, Explore, Category, and Search functionality.
- Added responsive mobile/tablet/desktop behavior.

### Files Created
- `src/pages/CheckoutPage.tsx`

### Files Modified
- `src/stores/cartStore.ts`
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutResultPage.tsx`
- `src/app/router.tsx`

### Routes
- `/cart`
- `/checkout`
- `/checkout/result`

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Home → Cart → PASS
- Search → Cart → PASS
- Explore → Category → Cart → PASS
- Product Detail → Cart → PASS
- Duplicate product quantity merging → PASS
- Quantity +/- controls → PASS
- Minimum quantity handling → PASS
- Product removal → PASS
- Dynamic line totals → PASS
- Dynamic overall total → PASS
- Cart badge synchronization → PASS
- Empty cart state → PASS
- Cart → Checkout → PASS
- Checkout item review → PASS
- Payment selection → PASS
- Place Order → PASS
- Cart clearing after order → PASS
- Checkout Result → PASS
- Back to Home → PASS
- Existing image assets → PASS
- Browser console errors → 0

### AI Review
- Cart state continues to use the existing `useCartStore` rather than introducing duplicate shopping state.
- Products added from Home, Search, Explore/Category, and Product Detail all converge into the same cart.
- Quantity changes and total calculations are derived from the actual cart contents.
- Checkout consumes the active cart rather than hardcoding products or prices.
- Payment behavior is intentionally simulated because real payment processing was not requested.
- Successful checkout clears the cart and keeps the global Cart badge consistent.
- Existing product and category image assets were explicitly preserved and verified.
- No unrelated backend, authentication, database, or future-screen work was introduced.
- The implementation maintains the previously completed application architecture.

### Human Decision
Accepted the Cart + Checkout implementation after manually reviewing the flow and confirming that products added from the existing Home, Search, Explore/Category, and Product Detail screens correctly appear in Cart.

Manually verified quantity controls, item removal, dynamic pricing, Cart badge updates, Checkout navigation, payment selection, order placement, cart clearing, and the Order Confirmation screen.

Confirmed that the previously working product/category images remain intact and that the implementation does not require changes to the completed Home, Product Detail, Explore, Category, or Search screens.

## Prompt 014 — Figma Favorite Products Flow

### Prompt
Implement the Figma Favorite Products flow.

Add a clear Favorite control to product cards across the relevant product-discovery screens so users can distinguish between:
- Adding a product to Cart using the existing `+` button.
- Adding/removing a product from Favorites using the Favorite icon.

Use the existing product catalog and application state architecture. Do not introduce duplicate product state, duplicate stores, backend APIs, authentication changes, database changes, or unnecessary dependencies.

Implement:
- Favorite toggle on relevant product cards.
- Clear visual distinction between Favorite and Add To Cart actions.
- Persistent favorite state while navigating between Home, Explore, Category, Search, Product Detail, and Favorite screens where applicable.
- Dedicated Favorite page showing only products currently marked as Favorite.
- Favorite product rows/cards with product image, name, unit, price, navigation affordance, and Favorite toggle.
- Favorite removal directly from the Favorite page.
- "Add All To Cart" action at the bottom of the Favorite page.
- Add All To Cart should transfer all currently favorited products into the existing global cartStore.
- Preserve existing cart quantities and cart behavior.
- Connect the Favorite bottom-navigation item to the Favorite page.
- Ensure the cart badge updates correctly after using "Add All To Cart."
- Keep the existing product images and image paths completely unchanged.

Use the existing Figma reference as the visual source of truth and preserve the existing application architecture.

Do not modify unrelated pages, product images, search behavior, cart behavior, checkout behavior, routing behavior, or existing product data unless strictly required for the Favorite feature.

Implement mobile-first and maintain the existing responsive desktop/tablet adaptation.

Run typecheck and production build and verify the complete Favorite flow in the browser.

### Result
- Implemented the Favorite product flow.
- Added Favorite controls to relevant product cards.
- Kept Favorite and Add To Cart as separate user actions.
- Added persistent Favorite state using the existing application state architecture.
- Implemented the dedicated Favorite page.
- Favorite page displays only products currently marked as Favorite.
- Added Favorite removal directly from the Favorite page.
- Added "Add All To Cart" functionality.
- Connected "Add All To Cart" to the existing global cartStore.
- Cart badge updates correctly after transferring favorite products to the cart.
- Connected the Favorite bottom-navigation item to the Favorite page.
- Preserved existing product images and image paths.
- Preserved existing Cart, Search, Explore, Category, Product Detail, and Checkout behavior.
- Corrected the UI terminology to consistently use **"Favorite"** instead of **"Favourite"**.

### Files Created
- None.

### Files Modified
- `src/pages/FavoritePage.tsx`
- `src/stores/...` — existing favorite state/store location, if applicable
- Relevant product-card/component files containing the Favorite control
- Relevant routing/navigation files, if applicable

### Route
- `/favorite`

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Home → Favorite → PASS
- Explore → Favorite → PASS
- Category → Favorite → PASS
- Search → Favorite → PASS
- Favorite toggle → PASS
- Favorite removal → PASS
- Favorite persistence across navigation → PASS
- Favorite page shows only favorited products → PASS
- Add All To Cart → PASS
- Cart badge update → PASS
- Existing cart behavior preserved → PASS
- Existing product images preserved → PASS
- Browser console errors → 0

### AI Review
- Favorite state reuses the existing application architecture rather than introducing duplicate product/cart state.
- Favorite and Cart actions remain intentionally separate so users can save a product without adding it to the cart.
- "Add All To Cart" transfers the currently favorited products into the existing cart rather than creating a separate checkout path.
- Existing product image paths and assets were not altered.
- Existing Home, Explore, Category, Search, Product Detail, Cart, and Checkout flows were preserved.
- The spelling inconsistency was corrected so the feature consistently uses **"Favorite"** throughout the UI.

### Human Decision
Accepted the implementation after manually testing the Favorite flow.

Confirmed:
- Favorite icons are clearly distinguishable from Add To Cart buttons.
- Products can be added to and removed from Favorites.
- Favorite products appear correctly on the Favorite page.
- Removing a Favorite works correctly.
- "Add All To Cart" transfers all Favorite products to the cart.
- Existing cart behavior remains intact.
- Product images remain correctly displayed.
- Navigation and responsive behavior are clean.
- Corrected the **"Favourite" → "Favorite"** spelling issue.

## Prompt 015 — Figma Screen 20/22: Checkout / Payment Flow

### Prompt
Implement the Figma Checkout / Payment flow shown in Screen 20/22.

Use the provided Figma reference as the visual source of truth. Implement the checkout experience as a bottom-sheet/modal flow opened from the Cart page.

The checkout flow must include:
- Delivery method selection
- Payment method selection
- Promo code / discount selection
- Dynamic total cost calculation
- Terms and conditions text
- Place Order CTA
- Connection to the existing cart state
- Navigation to the existing order confirmation screen after successful order placement

Delivery options should update the delivery fee and total dynamically.

Payment options should be mutually exclusive. The selected payment method must be reflected both inside the payment-selection UI and in the Checkout summary row.

Supported payment methods:
- Mastercard / Credit or Debit Card
- Cash on Delivery
- Mobile Banking

Promo selection should update the final payable amount dynamically.

Place Order should use the existing cart state, clear the cart after successful placement, and navigate to the existing checkout result / order confirmation screen.

Reuse the existing cartStore, routing architecture, product data, session state, and application layout.

Do not introduce a second cart store, payment store, backend payment gateway, authentication changes, database changes, or unnecessary dependencies.

Do not modify or replace existing product/category/banner images.

Do not alter Home, Explore, Category, Search, Favourite, Product Detail, or other unrelated page behavior.

Keep the implementation mobile-first and provide a clean responsive adaptation for larger viewports.

Run typecheck and production build and verify the complete Cart → Checkout → Order Confirmation flow in the browser.

### Result
- Implemented the Figma Checkout / Payment bottom-sheet flow.
- Added delivery method selection with dynamic delivery fees.
- Added mutually exclusive payment method selection.
- Added dynamic payment summary synchronization.
- Added promo code / discount selection.
- Added dynamic total cost calculation.
- Added Terms and Conditions acknowledgement text.
- Connected Place Order to the existing cart state.
- Connected successful order placement to the existing checkout result screen.
- Preserved the existing cart architecture and application routing.
- Preserved all existing product and category images.

### Files Created
- `src/components/cart/CheckoutModal.tsx`

### Files Modified
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`

### Route
- `/checkout`

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Cart → Checkout → PASS
- Delivery method selection → PASS
- Delivery fee calculation → PASS
- Payment method selection → PASS
- Payment summary synchronization → PASS
- Promo code selection → PASS
- Dynamic total calculation → PASS
- Place Order → PASS
- Checkout Result → PASS
- Existing Cart behavior → PASS
- Existing Favourite behavior → PASS
- Existing Search behavior → PASS
- Existing images → PASS (31/31 endpoints)
- Browser console errors → 0

### Bug Fix
During manual review, the Payment selection drawer initially displayed `Selected` for multiple payment methods simultaneously, and the Checkout summary continued displaying the Mastercard representation after switching to another payment method.

The issue was corrected by making payment selection mutually exclusive and deriving the Checkout summary directly from the active payment selection.

The Payment label was also corrected from `Pament` to `Payment`.

### Bug Fix Verification
- Mastercard / Card selection → PASS
- Cash on Delivery selection → PASS
- Mobile Banking selection → PASS
- Only the active payment method displays `Selected` → PASS
- Payment summary updates with selected method → PASS
- Delivery selection remains functional → PASS
- Promo code remains functional → PASS
- Dynamic total remains functional → PASS
- Place Order remains functional → PASS
- Existing images remain intact → PASS
- Browser console errors → 0

### AI Review
- Checkout state remains local to the Checkout flow and does not introduce a duplicate global cart/payment architecture.
- Payment selection is mutually exclusive and the summary is derived from the active selection, preventing stale UI state.
- Delivery fees and promo discounts are incorporated into the final total instead of using a hardcoded checkout amount.
- Existing cartStore remains the source of truth for cart contents.
- No backend payment integration was introduced because the Figma requirement is a frontend checkout/payment-selection experience.
- No product images or unrelated application screens were modified.
- Existing Cart, Favourite, Search, Product Detail, and order confirmation flows remain intact.

### Human Decision
Reviewed the Checkout flow manually after implementation and identified a payment-selection state bug where multiple payment methods appeared selected and the summary remained on Mastercard.

The bug was corrected and manually re-tested.

Accepted the implementation after confirming:
- Delivery selection works.
- Payment selection is mutually exclusive.
- Payment summary changes according to the selected method.
- Promo selection changes the total.
- Total cost updates correctly.
- Place Order completes the flow.
- Existing cart behavior remains intact.
- Existing images remain intact.

## Prompt 016 — Figma Screen 22/22: Order Success & Order Failure States

### Prompt
Implement the final Figma Screen 22/22 checkout outcome states: Order Success and Order Failure.

Use the provided Figma references as the visual source of truth. Implement two distinct post-checkout states while preserving the existing Cart → Checkout flow.

#### Order Success State
Implement the accepted-order screen matching the reference:

- Green circular checkmark illustration with the surrounding celebratory confetti/ribbons.
- Heading:
  `Your Order has been accepted`
- Supporting text:
  `Your items has been placed and is on it’s way to being processed`
- Primary green CTA:
  `Track Order`
- Secondary text action:
  `Back to home`
- Maintain the clean centered layout, typography, spacing, and soft background treatment from the reference.
- Make the screen responsive across mobile, tablet, and desktop.

#### Order Failure State
Implement the failed-order modal/state matching the reference:

- Dimmed background overlay.
- White rounded modal.
- Top-left close `X` action.
- Grocery bag illustration with groceries.
- Heading:
  `Oops! Order Failed`
- Supporting text:
  `Something went terribly wrong.`
- Primary green CTA:
  `Please Try Again`
- Secondary text action:
  `Back to home`
- Preserve the existing cart contents when an order fails so the user can retry.
- Make the modal responsive and accessible.

#### Checkout Integration
Connect these states to the existing checkout order-placement flow:

- Successful order placement → Success state.
- Failed order placement/error → Failure state.
- On success, clear the cart using the existing `cartStore`.
- On failure, do NOT clear the cart.
- `Please Try Again` must return the user to the existing checkout flow with the cart contents intact.
- `Track Order` should use the existing order-tracking/navigation behavior if already available.
- `Back to home` should navigate to the existing home route.
- Preserve existing checkout, cart, favorite, search, explore, category, and product-detail behavior.

#### Implementation Constraints
Reuse the existing routing, layout, cart state, checkout logic, and components wherever appropriate.

Do NOT:
- Modify product data.
- Modify product images or image paths.
- Replace, regenerate, or move existing image assets.
- Modify the Cart page behavior.
- Modify Favorite functionality.
- Modify Search functionality.
- Modify Explore or Category pages.
- Modify Product Detail functionality.
- Introduce a new backend/API.
- Introduce authentication changes.
- Introduce unnecessary dependencies.
- Create duplicate cart/order state.
- Rewrite unrelated components.
- Change existing checkout functionality except where necessary to route the order outcome into the correct success/failure state.

Keep the implementation strictly scoped to the final checkout result states and their integration with the existing checkout flow.

Run:
- `npm run typecheck`
- `npm run build`

Then manually verify both success and failure flows in the browser, including cart behavior and navigation.

### Result
- Implemented Figma Screen 22/22 Order Success and Order Failure states.
- Added the accepted-order success presentation with checkmark/confetti illustration, Track Order CTA, and Back to home action.
- Added the failed-order modal with grocery bag illustration, retry action, close action, and Back to home action.
- Integrated both states with the existing checkout order-placement flow.
- Success clears the cart.
- Failure preserves the cart for retry.
- Retry returns to the existing checkout flow with cart contents intact.
- Existing application architecture and checkout behavior were preserved.
- Responsive behavior was implemented for mobile/tablet/desktop.

### Files Created
- None.

### Files Modified
- `src/pages/CheckoutResultPage.tsx`
- `src/components/cart/CheckoutModal.tsx`

### Routes
- `/checkout/result?status=success`
- `/checkout/result?status=failed`
- Existing `/checkout` route preserved.

### Verification
- `npm run typecheck` → PASS
- `npm run build` → PASS
- Checkout → Success state → PASS
- Checkout → Failure state → PASS
- Success cart clearing → PASS
- Failure cart preservation → PASS
- Please Try Again → PASS
- Track Order → PASS
- Back to home → PASS
- Failure close `X` → PASS
- Existing Cart behavior → PASS
- Existing Favorite behavior → PASS
- Existing Search behavior → PASS
- Existing Explore/Category behavior → PASS
- Existing Product Detail behavior → PASS
- Existing product images → PASS
- Browser console errors → 0

### AI Review
- Reused the existing checkout and cart architecture instead of introducing duplicate state.
- Success and failure are represented as distinct checkout outcome states.
- Cart behavior is intentionally different for each outcome: success clears the cart, while failure preserves it for retry.
- Existing product data and image assets were left untouched.
- Existing application pages and functionality were preserved.
- The implementation remains scoped to the final checkout result experience.

### Human Decision
Accepted the implementation after manually reviewing the Order Success and Order Failure states and confirming the checkout outcome flow, navigation, retry behavior, and cart-state handling.