# 🎨 Ahoum Grocery App — Design Notes & Responsive Design Record

This document records the major visual design decisions, responsive adaptations,
Figma-to-implementation mappings, and design-system choices used throughout the
Ahoum Grocery App.

The goal is to document the final design direction concisely rather than
reproduce every implementation detail.

---

# 📐 Responsive Design Strategy

The application follows a **mobile-first Figma design** while providing a
purposeful desktop adaptation instead of simply stretching the mobile UI.

| Viewport | Primary Layout | Navigation | Product Layout |
|---|---|---|---|
| **Mobile `<640px`** | Single-column / compact sections | Fixed bottom navigation | 2-column product grid |
| **Tablet `640–767px`** | Flexible centered layout | Bottom navigation | 3-column product grid |
| **Desktop `≥768px`** | Centered application container | Desktop top navigation | Multi-column responsive grid |

### Core Principles

- Preserve the Figma visual hierarchy on mobile.
- Use responsive adaptations on larger screens rather than scaling mobile
  dimensions indefinitely.
- Keep product cards at usable desktop widths.
- Keep navigation appropriate to the interaction model of each viewport.
- Preserve existing product imagery and application state when implementing
  unrelated features.

---

# 📱 Figma Screen → Implementation Mapping

| Screen | Figma Area | Implementation | Main Design Treatment |
|---:|---|---|---|
| 01 | Splash | `SplashPage.tsx` | Brand-focused full-screen entry |
| 02 | Welcome / Onboarding | `WelcomeScreen.tsx` / onboarding flow | Full-screen grocery delivery hero |
| 03–08 | Authentication | Auth pages | Mobile forms with centered desktop adaptation |
| 09 | Shop Home | `HomePage.tsx` | Banner, offers, products and navigation |
| 10 | Exclusive Offer | `HomePage.tsx` | Product cards with Favourite + Add To Cart |
| 11 | Best Selling | `HomePage.tsx` | Responsive product section |
| 12 | Grocery Categories | `HomePage.tsx` | Pastel category presentation |
| 13 | Product Detail | `ProductDetailPage.tsx` | Dynamic product information and quantity controls |
| 14 | Explore Categories | `SearchPage.tsx` | Search + category discovery |
| 15 | Category Listing | `CategoryListingPage.tsx` | Product grid with filtering |
| 16 | Filter | `FilterSheet.tsx` | Separate Categories and Brands selections |
| 17–18 | Search | `SearchPage.tsx` | Search input and filtered product results |
| 19 | Cart | `CartPage.tsx` | Items, quantities, removal and checkout |
| 20 | Checkout | `CheckoutModal.tsx` | Delivery, payment, promo and total |
| 21 | Delivery | Checkout flow | Delivery-method selection |
| 22 | Payment | Checkout flow | Mutually exclusive payment selection |
| 23 | Promo | Checkout flow | Discount selection and total recalculation |
| 24 | Order Success | `CheckoutResultPage.tsx` | Accepted-order confirmation |
| 25 | Order Failure | `CheckoutResultPage.tsx` | Retryable failure state |
| 26 | Account | `AccountPage.tsx` | User information and account navigation |
| 27 | Order Tracking | Account flow | Order progress representation |
| 28 | Final supporting state | Application flow | Responsive state adaptation |

> Screen numbering is retained as a design-reference index; individual
> implementation components may cover more than one visual state.

---

# 🧭 Navigation Design

## Mobile

The application uses a fixed five-item bottom navigation:

- Shop
- Explore
- Cart
- Favourite
- Account

The active section uses the primary green brand color.

Cart and Favourite interactions use state-aware indicators where appropriate.

## Desktop

Desktop screens use a top application header with:

- Ahoum Grocery brand identity
- Catalog / Shop access
- Search
- Cart
- User / Account access

This avoids forcing desktop users to move the cursor to the bottom of a large
viewport for primary navigation.

---

# 🛒 Product Card Interaction Design

Product cards intentionally separate two important actions:

### Favourite

A heart icon represents saving a product to the Favourite list.

### Add To Cart

A green `+` button represents purchasing the product.

After a product has been added, the Add To Cart control can transition into a
compact quantity control so the user can immediately see how many units have
been selected without opening the Cart page.

This distinction prevents Favourite and purchase actions from being visually
ambiguous.

---

# 🔎 Search & Filtering Design

Search provides product discovery through a dedicated search interface.

Filtering is divided into clearly identifiable groups:

## Categories

Examples:

- Eggs
- Noodles & Pasta
- Chips & Crisps
- Fast Food

## Brands

Examples:

- Individual Collection
- Cocola
- Ifad
- Kazi Farmas

Filters use draft selection state and are applied through the **Apply Filter**
action.

The resulting product list must contain only products matching the applied
criteria.

The filter entry point is available from the relevant Explore/search experience
rather than being limited to one product-listing screen.

---

# ❤️ Favourite Design

Favourite state is independent from Cart state.

The Favourite page contains only products that the user has explicitly marked
as Favourite.

Each Favourite item provides:

- Product image
- Product name
- Product information
- Price
- Product navigation
- Favourite removal control

An **Add All To Cart** action transfers the currently favourited products into
the existing Cart state.

Favourite actions do not automatically add products to the Cart.

---

# 🛍️ Cart & Checkout Design

## Cart

The Cart presents:

- Selected product
- Product image
- Quantity
- Increment / decrement controls
- Remove action
- Line-item price
- Overall cart total
- Checkout CTA

All product sources use the same global Cart state.

Products added from Home, Explore, Search, Category, Product Detail, or
Favourite therefore converge into the same Cart.

## Checkout

Checkout is presented as a bottom sheet on mobile and a centered card on
larger screens.

The checkout flow contains:

1. Delivery method
2. Payment method
3. Promo code
4. Total cost
5. Terms acknowledgement
6. Place Order

The final amount is calculated dynamically from:

`Cart subtotal + Delivery fee - Promotion discount`

---

# 💳 Payment State Design

Payment methods are mutually exclusive.

Supported presentation states include:

- Mastercard / Card
- Cash on Delivery
- Mobile Banking

The checkout summary must always reflect the currently selected payment
method.

A previously encountered UI bug displayed `Selected` on multiple payment
options and kept the summary on Card after changing the payment method. This
was corrected by deriving the selected visual state from one active payment
selection.

---

# 📦 Order Outcome States

Checkout has two distinct outcomes.

## Success

The success state communicates:

- Order accepted
- Items are being processed
- Track Order action
- Back to Home action

Successful order placement clears the active Cart.

## Failure

The failure state communicates:

- Order failed
- Reason / supporting message
- Please Try Again action
- Back to Home action
- Close action

Failed orders preserve the Cart so the customer can retry without rebuilding
the order.

---

# 👤 Account Design

Account navigation must represent the authenticated application state.

Clicking Account should not unexpectedly send an authenticated user back to
Login / Signup.

The account area should provide:

- User name
- User email
- Account-related navigation
- Order access / tracking where available
- Remaining checkout or cart context where applicable

This follows the expected behavior of a real ecommerce application.

---

# 🖼️ Image & Asset Rules

Existing product, category, banner, and application imagery is treated as
protected unless an image change is explicitly requested.

When adapting an image responsively:

- Prefer CSS/object-position/layout changes.
- Do not replace working source assets unnecessarily.
- Do not change image paths while implementing unrelated features.
- Verify important image endpoints after major changes.

## Welcome Image

The Welcome screen uses a portrait delivery-person image.

On wide desktop screens, the image is constrained so that the delivery person's
face, body, and grocery basket remain visible without excessive zooming.

A surrounding ambient treatment may fill unused horizontal space while the
primary portrait retains its intended composition.

---

# 📐 Product Grid

The product grid adapts according to viewport size.

```text
Mobile

┌────────────┬────────────┐
│ Product 1  │ Product 2  │
├────────────┼────────────┤
│ Product 3  │ Product 4  │
└────────────┴────────────┘


Desktop

┌─────────┬─────────┬─────────┬─────────┐
│ Prod 1  │ Prod 2  │ Prod 3  │ Prod 4  │
├─────────┼─────────┼─────────┼─────────┤
│ Prod 5  │ Prod 6  │ Prod 7  │ Prod 8  │
└─────────┴─────────┴─────────┴─────────┘
```

The desktop container is centered and constrained so cards remain visually
comfortable instead of becoming excessively wide.

---

# 🎨 Design System

## Brand Palette

```css
--color-primary: #53B175;
--color-primary-hover: #479B66;
--color-primary-light: #EEF8F2;
--color-dark: #181725;
--color-grey: #7C7C7C;
--color-border: #E2E2E2;
```

## Category Accents

```css
--cat-green: #EEF8F2;
--cat-green-border: #53B175;

--cat-orange: #FFF6EE;
--cat-orange-border: #F7A593;

--cat-pink: #FDE8E4;
--cat-pink-border: #FDE8E4;

--cat-purple: #F4EBF7;
--cat-purple-border: #D3B0E0;

--cat-yellow: #FEF8E5;
--cat-yellow-border: #FDE598;

--cat-blue: #EDF7FC;
--cat-blue-border: #B7DFF5;
```

---

# 🧠 Human Design Decisions

The following principles were applied during AI-assisted implementation:

1. **Figma is the visual reference, not an excuse to copy obvious mistakes.**
2. **Mobile-first does not mean desktop should be a stretched mobile screen.**
3. **Favourite and Cart are intentionally different user actions.**
4. **Filters must affect the actual product results, not merely change UI state.**
5. **Checkout selections must visibly synchronize with their summary rows.**
6. **Successful and failed orders have different Cart-state behavior.**
7. **Authenticated Account navigation must behave like an ecommerce account area.**
8. **Existing images are protected from unrelated AI modifications.**
9. **Responsive adaptations should solve usability problems rather than
   introduce visual complexity.**
10. **AI-generated regressions are corrected through manual browser review,
    not accepted merely because the build succeeds.**

---

# 🔍 Known Design Issues / Limitations

- The Welcome screen uses a portrait-oriented source image, so desktop
  presentation requires responsive framing rather than a simple full-bleed
  stretch.
- The payment flow is a frontend/simulated payment experience rather than a
  real payment gateway integration.
- Order tracking is a frontend representation rather than a live logistics
  backend.
- Product, delivery, promotion, and account data are currently constrained by
  the assignment's available frontend data/state.

---

# ✅ Design Validation

Major design flows were manually checked across mobile and desktop
viewports.

Validation includes:

- Figma visual comparison
- Responsive layout checks
- Product image rendering
- Favourite interactions
- Cart interactions
- Checkout interactions
- Payment state synchronization
- Filter application
- Account navigation
- Success/failure states
- Browser console review
- TypeScript validation
- Production build validation

The design record intentionally documents the final accepted direction rather
than every intermediate AI-generated iteration.
