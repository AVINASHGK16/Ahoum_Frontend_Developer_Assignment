# 🤖 Ahoum Grocery App — AI Prompt Log & Supervision Record

This document records the material AI-assisted development work,
architectural decisions, verification results, AI mistakes, and human
corrections made during the development of the Ahoum Grocery App.

The complete conversational prompt history is intentionally not reproduced
here. This document provides a concise engineering record of the important
implementation phases and human supervision decisions.

---

# 📊 AI Execution & Prompt Audit

| ID | Feature / Objective | AI Action | Human Supervision / Decision | Verification |
|---|---|---|---|---|
| P-01 | Project foundation | Established the Vite + React + TypeScript + Tailwind frontend structure and existing application architecture. | Preserved the existing project structure and avoided unnecessary architectural changes. | Typecheck + production build |
| P-02 | Home / Shop | Implemented the main grocery shopping experience and connected product data to reusable product cards. | Required product cards and quick-add behavior to remain compatible with the existing cart architecture. | Browser flow + responsive verification |
| P-03 | Product Detail | Implemented dynamic `/product/:productId` product information page. | Required a single dynamic page instead of separate hardcoded pages for every product. | Product navigation + quantity + cart verification |
| P-04 | Explore Categories | Implemented Figma Explore screen with six grocery categories and responsive category cards. | Preserved the Figma category structure, colors, imagery, and existing navigation architecture. | Visual comparison + browser verification |
| P-05 | Category Product Listing | Implemented `/category/:categoryId` with dynamic product listings and two-column mobile layout. | Reused existing product data and cart state rather than introducing duplicate product logic. | Category navigation + product rendering |
| P-06 | Search | Implemented `/search?q=...` with URL-synchronized search and dynamic product filtering. | Search results were required to come from the product catalogue rather than being hardcoded. | Search queries + clear action + result verification |
| P-07 | Favourite | Added favourite state to products and implemented the Favourite page with Add All To Cart behavior. | Required clear visual separation between Favourite and Add To Cart actions and reuse of existing product/cart state. | Favourite toggle + Favourite page + Add All To Cart |
| P-08 | Cart | Implemented the Figma Cart screen with quantity controls, removal, dynamic totals, and global cart state. | Required cart state to remain shared across Home, Explore, Search, Product Detail, and Favourite flows. | Add → Cart → quantity → removal → total |
| P-09 | Checkout | Implemented checkout bottom sheet with delivery method, payment method, promo code, total calculation, and Place Order. | Required checkout to reuse the existing cart state and avoid introducing duplicate stores or backend payment infrastructure. | Delivery + payment + promo + total + order placement |
| P-10 | Payment Selection | Corrected payment selection state so only the active payment method is marked selected and the summary reflects the active choice. | Human testing identified that multiple options incorrectly displayed `Selected` and the summary remained on card payment. | Card + COD + Mobile Banking |
| P-11 | Order Result | Implemented separate order success and failure states. | Success clears the cart; failure preserves the cart for retry. | Success + failure + retry flows |
| P-12 | Filtering | Implemented category and brand filtering with clearly separated filter groups and applied-result behavior. | Required filters to actually affect displayed products and remain available from the relevant Explore/Search experience. | Filter selection + Apply Filter + result verification |
| P-13 | Account | Corrected Account navigation so authenticated users reach their account information instead of being incorrectly redirected to Login/Signup. | Required username/email, account-related navigation, cart/favourite access, and realistic authenticated-user behavior. | Bottom navigation + account flow |
| P-14 | Cart Quantity UX | Improved product-card Add To Cart feedback so users can see the current quantity without immediately opening Cart. | Required the interaction to remain compact and not interfere with Favourite or quick-add behavior. | Repeated add operations + quantity display |
| P-15 | Asset Stability | Audited product/category/banner image paths after image-loading regressions occurred during AI implementation. | Existing working image assets were treated as protected resources and unrelated image changes were prohibited. | Asset endpoint checks + browser verification |
| P-16 | Welcome Screen | Corrected responsive framing of the portrait welcome image on desktop while preserving the source asset. | Human testing identified excessive cropping/zooming. Final solution preserved the image composition and avoided further unnecessary asset changes. | Mobile + tablet + desktop |
| P-17 | Final Regression Review | Performed a final project-wide verification pass across existing flows. | Required fixes to be scoped to actual bugs and prevented unrelated refactoring or redesign. | Typecheck + build + browser regression testing |

---

# 🛠️ AI Mistakes & Human Supervision Corrections

## 1. Image Asset Regression

### AI Mistake

During implementation of the search/category functionality, existing image
paths/assets were changed or replaced, causing previously working product and
category images to disappear.

### Human Detection

Manual browser verification revealed broken image rendering even though the
underlying application flow was functioning.

### Correction

Existing asset paths were restored and the image set was explicitly checked
again.

### Lesson

Existing working assets must be treated as protected dependencies when
implementing unrelated features.

---

## 2. Payment Selection State

### AI Mistake

The payment drawer initially displayed `Selected` for multiple payment
methods simultaneously. The checkout summary also continued displaying the
card payment indicator after another payment method was chosen.

### Human Detection

Manual comparison with the Figma payment-selection state exposed the
inconsistent state.

### Correction

Payment selection was changed to use a single active payment method and the
checkout summary was synchronized with that selection.

### Verification

- Mastercard/Card → PASS
- Cash on Delivery → PASS
- Mobile Banking → PASS

---

## 3. Checkout Label Typo

### AI Mistake

The checkout interface initially contained the Figma typo:

`Pament`

### Human Correction

Changed the user-facing label to:

`Payment`

The same approach was applied to other obvious user-facing Figma copy
mistakes where appropriate.

---

## 4. Favourite Spelling / Copy Issue

### AI Mistake

The Favourite flow contained an inconsistent spelling/copy issue during
implementation.

### Human Detection

Manual review against the reference screens identified the mismatch.

### Correction

Standardized the user-facing terminology to `Favourite` throughout the
application.

---

## 5. Account Navigation

### AI Mistake

Clicking the Account navigation item incorrectly redirected the user toward
the Login/Signup experience instead of showing the authenticated user's
account area.

### Human Detection

Manual testing identified that the behavior did not represent a realistic
authenticated grocery application.

### Correction

Account navigation was changed to show the user's account/profile state,
including account-related information and access to relevant sections.

### Lesson

Navigation behavior must be evaluated from the user's application state,
not only from whether a route technically renders.

---

## 6. Filter Availability

### AI Mistake

Filtering was implemented but was not consistently available from the
required Explore experience.

### Human Detection

Manual navigation showed that the filter control was missing where the user
expected it.

### Correction

The filter entry point was added to the relevant Explore/search interface and
the applied filters were connected to the displayed product results.

---

## 7. Welcome Image Framing

### AI Mistake

Attempts to make the portrait welcome image responsive caused excessive
desktop zoom/cropping and hid the delivery person's face and body.

### Human Detection

Manual testing at wider desktop viewports revealed the composition problem.

### Correction

The final implementation constrained the primary portrait image on wide
screens and used the surrounding image treatment to fill unused horizontal
space without modifying the source asset.

### Human Decision

Once the image framing became stable, further image modifications were
stopped to avoid repeated regressions.

---

# 🧠 Human Supervision & Engineering Decisions

## Scope Protection

AI-assisted implementation was kept strictly scoped to the requested
feature.

Unrelated:

- routes
- stores
- product data
- image assets
- authentication
- existing navigation
- checkout state
- working application flows

were not to be modified unless explicitly required.

---

## State Management

Existing application state architecture was reused.

No unnecessary duplicate:

- cart store
- favourite store
- session store
- checkout store

was introduced where existing state could satisfy the requirement.

---

## Dynamic Product Pages

Product details use a single dynamic route:

`/product/:productId`

rather than creating a separate React page for every product.

---

## Search

Search results are derived from the product catalogue and synchronized with
the URL query parameter.

Example:

`/search?q=egg`

---

## Cart

The cart is treated as global application state so products added from:

- Home
- Explore
- Category
- Search
- Product Detail
- Favourite

are represented by the same cart.

---

## Checkout

Checkout consumes the active cart state and dynamically calculates the final
amount from:

`cart subtotal + delivery fee - promotion discount`

Payment selection and delivery selection are maintained as independent
checkout choices.

---

## Order Outcome

Successful orders clear the cart.

Failed orders preserve the cart so the user can retry.

This was intentionally chosen to represent realistic ecommerce behavior.

---

## Responsive Design

The original mobile-oriented Figma screens were treated as the primary
visual reference.

Tablet and desktop layouts were implemented as responsive adaptations rather
than simply stretching the mobile layout.

---

## Asset Protection

After multiple image regressions during AI-assisted development, existing
image assets were treated as protected resources.

Feature implementation should not modify image files or paths unless the
image change itself is explicitly requested.

---

# ✅ Final Verification

## Build

- `npm run typecheck` → PASS
- `npm run build` → PASS

## Core User Flows

- Welcome → PASS
- Authentication → PASS
- Home / Shop → PASS
- Explore → PASS
- Category → PASS
- Search → PASS
- Product Detail → PASS
- Favourite → PASS
- Cart → PASS
- Checkout → PASS
- Delivery selection → PASS
- Payment selection → PASS
- Promo code → PASS
- Order Success → PASS
- Order Failure → PASS
- Account → PASS

## State Verification

- Global cart state → PASS
- Quantity updates → PASS
- Cart removal → PASS
- Favourite state → PASS
- Add All To Cart → PASS
- Checkout total calculation → PASS
- Payment state synchronization → PASS
- Failed-order cart preservation → PASS
- Successful-order cart clearing → PASS

## Regression Checks

- Product images → PASS
- Category images → PASS
- Search images → PASS
- Cart images → PASS
- Navigation → PASS
- Responsive layout → PASS
- Browser console → 0 errors

---

# 👤 Human Acceptance

The implementation was reviewed manually after each major feature and
corrective iteration.

Features were accepted only after:

1. Comparing the implementation against the Figma reference.
2. Testing the relevant user interaction in the browser.
3. Checking that existing flows remained functional.
4. Running TypeScript validation.
5. Running the production build.
6. Correcting AI-generated regressions where discovered.

The final implementation was considered ready for deployment after the
project-wide regression review.