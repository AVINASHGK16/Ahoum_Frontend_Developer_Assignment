🐞 Ahoum Grocery App — Debugging & Troubleshooting Log

This document records significant bugs, build failures, navigation defects,
deployment issues, and UX/state inconsistencies discovered during development.

The goal is to document the symptom → diagnosis → root cause → fix →
verification rather than preserve raw AI debugging transcripts.

📊 Issue Summary

Issue ID

Category

Symptom

Root Cause

Fix

Status

BUG-01

TypeScript

CSS side-effect import could not be resolved

Missing Vite ambient type definitions

Added vite-env.d.ts and Vite client types

✅

BUG-02

Vite / Build

Vite could not resolve application entry module

index.html referenced main.ts instead of main.tsx

Corrected the entry script

✅

BUG-03

Checkout / Layout

Desktop checkout displayed unnecessary vertical scrolling

Checkout was constrained by a narrow modal width and tight layout

Expanded BottomSheet width and reworked checkout spacing

✅

BUG-04

Navigation / State

Authenticated navigation could enter the wrong account/tracking state

Account/order state was not explicitly reset during navigation

Made navigation state-aware and reset the appropriate account section

✅

BUG-05

Deployment / Routing

Refreshing deep routes returned Vercel 404

Static hosting did not automatically rewrite SPA routes to index.html

Added a Vercel SPA rewrite

✅

BUG-06

Account UX

Clicking Account could return an authenticated user to Login/Signup

Account was treated as an authentication-entry destination

Reused session/authentication state for conditional navigation

✅

BUG-07

Filter UX

Explore did not expose the existing product filtering capability

Filtering was initially available only through other product-discovery paths

Reused the shared category/brand filter flow in Explore

✅

BUG-08

Checkout State

Payment drawer could visually mark multiple options / summary could remain on Card

Selection state and summary representation were not synchronized

Made payment selection mutually exclusive and derived summary from active payment state

✅

BUG-09

Asset Regression

Product/category/search images intermittently stopped displaying after unrelated changes

Image paths/assets were unintentionally changed during feature implementation

Restored/protected existing local asset paths and verified image endpoints

✅

BUG-10

Welcome Responsive Layout

Desktop welcome image became excessively zoomed and hid the delivery person's body

A portrait image used object-cover across a much wider viewport

Added constrained centered image framing and a separate ambient background layer

✅

BUG-11

Product Add UX

Repeated Add actions gave insufficient immediate quantity feedback

Product card showed only a + action after an item entered the cart

Added visible cart quantity controls/count feedback on product cards

✅

🔍 Detailed Issue Teardowns

BUG-01 — TypeScript CSS Side-Effect Import

Symptom

Running TypeScript validation produced an error similar to:

Cannot find module or type declarations for side-effect import of './index.css'

Diagnosis

The strict TypeScript configuration did not have the Vite ambient client
definitions required for CSS imports.

Fix

Added:

/// <reference types="vite/client" />

through src/vite-env.d.ts and ensured the compiler could resolve Vite client
types.

Verification

Typecheck → PASS

Production build → PASS

BUG-02 — Vite Entry Module Mismatch

Symptom

Production build failed because Vite attempted to resolve:

src/main.ts

while the React entry file was:

src/main.tsx

Root Cause

The index.html script entry referenced the wrong extension.

Fix

Changed the module entry to:

<script type="module" src="/src/main.tsx"></script>

Verification

Vite production build → PASS

Application startup → PASS

BUG-03 — Desktop Checkout Scrollbar

Symptom

The checkout interface displayed unnecessary internal vertical scrolling on
desktop.

Root Cause

The shared bottom-sheet container was too narrow for the checkout content.
The constrained width compressed rows and caused overflow.

Fix

The shared modal infrastructure was extended to support a wider desktop
presentation.

Checkout spacing and row layout were adjusted so the desktop version behaves
as a spacious centered card rather than a stretched mobile sheet.

Verification

Desktop checkout → PASS

Delivery selection → PASS

Payment selection → PASS

Promo interaction → PASS

Total calculation → PASS

Typecheck → PASS

Build → PASS

BUG-04 — Incorrect Navigation State After Authentication / Orders

Symptom

A user could enter an Order Tracking/account state when the intended
destination after authentication was the Shop/Home experience.

Diagnosis

Account/order UI state could remain from a previous application state instead
of being explicitly reset during navigation.

Fix

Navigation handlers were updated so:

Successful authentication
        ↓
Shop / Home

Explicit Track Order action
        ↓
Order Tracking

Account sections are reset explicitly rather than inheriting stale state.

Verification

Login → Shop → PASS

Explicit order tracking → PASS

Account navigation → PASS

Existing cart/order behavior → PASS

BUG-05 — Vercel SPA Deep-Link 404

Symptom

Opening or refreshing routes such as:

/cart
/explore
/category/beverages
/product/:productId

could produce a Vercel 404 instead of loading the React application.

Root Cause

The deployment is a client-side SPA. Vercel's static routing layer could
interpret a deep URL as a request for a physical file instead of forwarding the
request to the application's root HTML entry.

Fix

Added an SPA rewrite through vercel.json so application routes resolve to
the Vite index.html entry.

Verification

Deep-link refresh testing confirmed the React router could hydrate the
requested route without a server-side 404.

BUG-06 — Account Navigation Redirected Authenticated Users to Login

Symptom

Clicking the Account bottom-navigation item redirected an authenticated user
to the Login / Sign Up flow.

Diagnosis

The navigation did not distinguish between authenticated and unauthenticated
application state.

Root Cause

Account navigation was effectively treated as an authentication-entry action
rather than an authenticated application destination.

Fix

Reused the existing session/authentication state:

Authenticated
    ↓
Account page

Unauthenticated
    ↓
Login / Sign Up

No second authentication store was introduced.

Verification

Authenticated → Account page: PASS

Unauthenticated → Login/Sign Up: PASS

Bottom navigation: PASS

Typecheck: PASS

Production build: PASS

BUG-07 — Filter Missing from Explore

Symptom

Category and brand filtering worked in the existing product-discovery flow,
but the Explore screen did not expose the same capability.

Diagnosis

Explore was implemented as a category-discovery surface without an entry point
to the established filter system.

Fix

The existing filter implementation was reused rather than creating a second
Explore-specific filter state.

The filter model remains:

Categories
+
Brands
     ↓
Apply Filter
     ↓
Matching Products

Verification

Explore filter entry point → PASS

Category filtering → PASS

Brand filtering → PASS

Apply Filter → PASS

Product results update → PASS

Existing Search filtering → PASS

BUG-08 — Checkout Payment Selection State

Symptom

The checkout payment drawer could show incorrect selection state, while the
summary row continued to display the card representation after another payment
method was chosen.

Root Cause

Payment option selection and the summary representation were not derived from
one mutually exclusive active selection.

Fix

Payment selection was changed to a single active payment value.

The summary now derives from that state:

Credit / Debit Card
    ↓
Mastercard / Card representation

Cash on Delivery
    ↓
Cash on Delivery

Mobile Banking
    ↓
Mobile Banking

The checkout label was also corrected from the Figma typo Pament to
Payment.

Verification

Card selection → PASS

Cash on Delivery selection → PASS

Mobile Banking selection → PASS

Summary synchronization → PASS

Existing delivery/promo/total behavior → PASS

Typecheck → PASS

Build → PASS

BUG-09 — Image Asset Regression

Symptom

Existing images stopped displaying after changes to search/explore/product
data.

Diagnosis

The functionality being implemented was correct, but image paths/assets had
been altered during unrelated data or feature changes.

Fix

Existing local image assets and their referenced paths were restored and
treated as protected dependencies for subsequent feature work.

Image endpoints were explicitly checked rather than assuming that a successful
build meant the assets were valid.

Verification

The application's image set was checked through the development server and
expected image endpoints returned successful HTTP responses.

Engineering Lesson

A successful TypeScript build does not prove that static assets resolve
correctly at runtime.

For asset-heavy UI changes, browser verification and direct asset checks are
both useful.

BUG-10 — Welcome Screen Image Over-Zoom on Desktop

Symptom

The Welcome screen looked acceptable on mobile but became severely zoomed on
wide desktop displays. The delivery person's face/body and groceries were
partially pushed outside the visible composition.

Root Cause

A portrait-oriented image was being used with full-width/full-height
object-cover behavior on a much wider viewport.

The aspect-ratio mismatch forced excessive scaling.

Fix

The welcome screen was changed to use:

A constrained centered primary image container.

Appropriate object positioning.

A separate blurred/ambient background layer to fill wide-screen space.

The existing foreground overlay and CTA hierarchy.

This preserved the subject's framing without replacing the underlying image.

Verification

Reviewed across:

Mobile

Tablet

Desktop

Wide desktop

Typecheck and production build both passed.

Engineering Lesson

Responsive image problems should first be solved through composition,
container constraints, and object positioning rather than repeatedly replacing
the asset.

BUG-11 — Product Add-to-Cart Quantity Feedback

Symptom

The product-card + button added an item correctly, but the customer could
not immediately tell how many times the product had been added.

The quantity became visible only after navigating to the Cart.

Root Cause

The product card represented the action but not the current cart quantity.

Fix

Product cards now expose the current quantity once an item exists in the cart,
allowing the customer to understand and adjust the selected quantity directly.

Conceptually:

Not in cart

        [+]


In cart

      [-]  2  [+]

Verification

First add → quantity feedback visible

Increment → quantity updates

Decrement → quantity updates

Cart state remains synchronized

Existing product/card navigation preserved

🧠 Debugging Principles

1. Build Success Is Not Runtime Success

npm run typecheck and npm run build verify compilation and bundling, but do
not prove:

Images load.

Navigation is correct.

State transitions are correct.

Responsive layouts are usable.

Modals behave correctly.

Deep links work after deployment.

Therefore significant changes require browser verification.

2. Diagnose Before Modifying

For visual or state bugs, the preferred sequence is:

Reproduce
   ↓
Inspect current implementation
   ↓
Identify ownership / root cause
   ↓
Apply smallest scoped fix
   ↓
Run typecheck
   ↓
Run production build
   ↓
Browser regression test

This prevents speculative changes from creating secondary regressions.

3. Protect Unrelated Functionality

Feature work is intentionally scoped.

When implementing one feature:

Do not rewrite unrelated stores.

Do not replace working images.

Do not introduce duplicate global state.

Do not modify authentication architecture without a requirement.

Do not change working routes unnecessarily.

Do not implement future screens prematurely.

4. Verify State Transitions, Not Just Screens

For stateful functionality, verification should follow the user's action chain.

Examples:

Add Product
   ↓
Cart State
   ↓
Cart Badge
   ↓
Cart Quantity
   ↓
Checkout Total

and:

Select Payment
   ↓
Active Payment State
   ↓
Summary Row
   ↓
Place Order
   ↓
Success / Failure State

This catches synchronization bugs that static visual inspection can miss.

5. Human Review Remains the Final Validation Layer

AI-assisted implementation can produce technically valid code that still has:

Incorrect UX semantics

Figma copy mistakes

Navigation inconsistencies

Visual regressions

State synchronization bugs

Unnecessary architectural changes

The project therefore treats AI output as an implementation proposal that must
be verified against the Figma, runtime behavior, and application architecture.

📋 Current Debugging Status

All issues documented above were resolved and re-tested as part of the
corresponding feature work.

Before deployment, the project should still receive a final regression pass
covering:

Authentication/onboarding

Home

Explore

Category listing

Search

Product details

Favourite

Cart

Checkout

Success/failure states

Account

Responsive behavior

Deep-link refresh

Static image loading

Browser console errors

