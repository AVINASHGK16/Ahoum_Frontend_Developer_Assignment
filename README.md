# Ahoum — Frontend Developer Assignment

A responsive, mobile-first grocery delivery web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**, and **React Router**, faithfully implementing the provided Figma design references.

---

## 1. Project Overview

This project is a modern grocery delivery single-page application (SPA) created for the Ahoum Frontend Developer Assignment. The interface is built mobile-first according to the Figma specification and adapts cleanly to tablet and desktop viewports.

### Primary User Flow
```text
Splash Screen
  ↓
Welcome & Onboarding
  ↓
Authentication (Login / Signup / Phone / Verification)
  ↓
Location Selection
  ↓
Home / Store Catalog
  ├── Category Exploration & Product Listings
  ├── Live Search with Multi-Criteria Filtering (Categories & Brands)
  ├── Product Information & Details
  ├── Favourite Products & "Add All To Cart"
  └── Cart Management (Quantity Steppers, Item Removal, Dynamic Subtotal)
        ↓
    Checkout Bottom Sheet (Delivery, Payment, Promo Discounts, Terms)
        ↓
    Order Outcome (Accepted Order Confirmation OR Order Failure with Retry)
        ↓
    Account Overview & Pending Checkout State
```

---

## 2. Assignment Requirements & Architectural Constraints

- **Core Technologies**: React 18, TypeScript in strict mode, Vite, Tailwind CSS, Zustand, React Router 6.
- **Data Layer**: Asynchronous mock API services backed by static JSON datasets with simulated latency and error handling.
- **Responsive Design**: Mobile-first layout matching Figma screens, adapted cleanly for larger screens using max-width container constraints.
- **State Feedback**: Robust loading spinners, empty search/cart/favourite states, error messages with retry actions, and active filter badges.
- **Async Safety**: Stale-response protection preventing out-of-order search responses from overwriting newer user queries.
- **Strict Scope Boundaries**:
  - **No Redux, MobX, or Context API** for global state (Zustand is used exclusively).
  - **No bloated UI component libraries** (all components use vanilla Tailwind CSS and custom SVG icons).
  - **No external backend infrastructure** (self-contained mock services).

---

## 3. Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | UI component architecture |
| **React DOM** | `^18.3.1` | DOM rendering |
| **TypeScript** | `^5.7.2` | Static type safety (`strict: true`) |
| **Vite** | `^6.0.3` | Development server and production bundler |
| **Tailwind CSS** | `^3.4.17` | Utility-first styling & design tokens |
| **Zustand** | `^5.0.2` | Global application state management |
| **React Router DOM** | `^6.28.0` | Client-side routing and URL synchronization |
| **PostCSS & Autoprefixer** | `^8.4.49` / `^10.4.20` | CSS preprocessing and vendor prefixing |

---

## 4. Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AVINASHGK16/Ahoum_Frontend_Developer_Assignment.git
   cd "Ahoum Frontend-Development Assignment"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!NOTE]
> No environment variables (`.env`) are required. All mock data and simulated services run locally within the application bundle.

### Verification Scripts

- **Typecheck**: `npm run typecheck` (Executes `tsc --noEmit` under strict TypeScript mode).
- **Production Build**: `npm run build` (Executes TypeScript project compilation and Vite production build).
- **Preview Production Build**: `npm run preview` (Serves the `dist/` production bundle locally).

---

## 5. Application Architecture

The codebase follows a modular, feature-oriented structure with clear separation of concerns:

```text
src/
├── app/                  # Application bootstrap and router configuration
│   ├── App.tsx           # Root provider wrapper
│   └── router.tsx        # React Router route definitions
├── components/           # Reusable presentational and container components
│   ├── cart/             # Cart-related components (CheckoutModal, etc.)
│   ├── feedback/         # UI feedback (LoadingSpinner, ErrorMessage)
│   ├── filter/           # FilterModal and checkbox controls
│   ├── layout/           # AppLayout, BottomNav, and headers
│   ├── product/          # ProductCard, CategoryCard, ProductStepper
│   └── search/           # Search-specific UI components
├── data/                 # Canonical JSON catalog datasets
│   ├── categories.json   # 6 primary grocery categories
│   └── products.json     # 24 catalog products with brand metadata
├── hooks/                # Reusable React data-fetching & async state hooks
│   ├── useCategories.ts  # Category querying hook
│   ├── useProducts.ts    # Product listing and category filtering hook
│   └── useSearch.ts      # Product search with race-condition protection
├── pages/                # Screen-level route components (19 route pages)
│   ├── AccountPage.tsx   # Authenticated user account & pending checkout
│   ├── CartPage.tsx      # Cart item listing & checkout trigger
│   ├── CategoryPage.tsx  # Dynamic category product listing
│   ├── CheckoutPage.tsx  # Checkout entry wrapper
│   ├── CheckoutResultPage.tsx # Order Accepted & Order Failed states
│   ├── ExplorePage.tsx   # Category grid with integrated filter control
│   ├── FavouritePage.tsx # Favourited products list & "Add All To Cart"
│   ├── FiltersPage.tsx   # Dedicated standalone filters route
│   ├── HomePage.tsx      # Main store catalog, banners, exclusive offers
│   ├── LocationScreen.tsx# Location selection screen
│   ├── LoginScreen.tsx   # User login screen with field validation
│   ├── ProductDetailPage.tsx # Dynamic product info with nutrition accordions
│   ├── SearchPage.tsx    # Live URL-synchronized search with filters
│   ├── SignupScreen.tsx  # User registration screen
│   ├── SplashScreen.tsx  # Initial branded splash animation
│   └── WelcomeScreen.tsx # Onboarding welcome screen
├── services/             # Data access boundary
│   └── mockApi/          # Simulated asynchronous backend services
│       ├── categoriesApi.ts # Category fetcher with simulated delay
│       ├── productsApi.ts   # Product fetcher by ID or category
│       └── searchApi.ts     # Product search service
├── stores/               # Zustand global state stores
│   ├── cartStore.ts      # Cart items, quantities, totals, and actions
│   └── sessionStore.ts   # User authentication, location, and favourites
├── types/                # TypeScript interface definitions
│   ├── api.ts            # API request/response types
│   ├── cart.ts           # Cart data types
│   ├── product.ts        # Product & Category models
│   └── user.ts           # Session & Location models
└── utils/                # Pure domain-independent helper utilities
    └── filterUtils.ts    # Category and brand matching logic (OR/AND semantics)
```

### Architectural Boundaries
- **Pages**: Compose entire screens and wire route parameters.
- **Components**: Presentational elements receiving props and emitting callbacks.
- **Hooks**: Bridge UI components with mock asynchronous API services.
- **Mock API Services**: Isolate data-access concerns and simulate network latency (200–400ms).
- **Zustand Stores**: Hold minimal global state that spans disjoint routes (`cartStore`, `sessionStore`).
- **Static JSON**: Serves as the mock database and is never imported directly into leaf UI components.

---

## 6. Global State Management

Global state is organized into two distinct, lightweight Zustand stores:

### 1. Cart Store (`src/stores/cartStore.ts`)
Manages all active cart items and totals:
- `items: CartItem[]`: Array of product items with explicit quantities.
- `itemsCount: number`: Total number of individual units in the cart.
- `addItem(product, quantity)`: Appends a new item or increments quantity if already present.
- `updateQuantity(productId, quantity)`: Updates quantity or removes item if quantity reaches 0.
- `removeItem(productId)`: Removes the product line item completely.
- `clearCart()`: Empties the cart (invoked on successful order placement).
- `getTotalAmount()`: Dynamically calculates the subtotal from active line items.

### 2. Session Store (`src/stores/sessionStore.ts`)
Manages user authentication, location preferences, and product favourites:
- `user: UserSession | null`: Stores `email`, `username`, and `isAuthenticated` boolean.
- `location: UserLocation | null`: Stores current delivery zone and area (defaulting to Dhaka, Banasree).
- `favorites: string[]`: Stores IDs of products favourited by the user (avoids duplicated product objects).
- `toggleFavorite(productId)`: Adds or removes a product ID from favourites.
- `login(email, username)` / `signup(email, username)`: Sets active session.
- `logout()`: Clears active user session.

---

## 7. Main User Flows

### A. Product Discovery
1. **Home (`/`)**: Displays delivery location header, fresh vegetable banner, search bar, Exclusive Offer carousel, Best Selling section, and Groceries collection cards.
2. **Explore (`/explore`)**: Displays category cards and search bar with direct access to the category/brand Filter drawer.
3. **Category Listing (`/category/:categoryId`)**: Dynamic product grid filtered by category with interactive filter button.
4. **Product Detail (`/product/:productId`)**: Dynamic product page with quantity steppers, favorite heart button, expandable "Product Detail" & "Nutritions" accordions, review star rating, and "Add To Basket" button.

### B. Product Search & Filtering
1. **Search (`/search?q=...`)**: Full-text, case-insensitive search synchronized with the browser URL query parameter.
2. **Filters (Screen 17/22)**:
   - **Categories**: Multi-select options (`Eggs`, `Noodles & Pasta`, `Chips & Crisps`, `Fast Food`).
   - **Brands**: Multi-select options (`Individual Callection`, `Cocola`, `Ifad`, `Kazi Farmas`).
   - **Filter Logic**:
     - Within same group: `OR` (e.g., `Eggs OR Noodles & Pasta`).
     - Across different groups: `AND` (e.g., `(Eggs OR Noodles & Pasta) AND (Cocola OR Ifad)`).
     - Combined with search: `Query ∩ Categories ∩ Brands`.
   - Committed only when the user clicks **"Apply Filter"**; closing without applying reverts pending selections.

### C. Favourites & Cart Integration
1. **Favouriting**: Clicking the heart icon on any product card or detail page toggles the product in `sessionStore.favorites` without affecting cart state.
2. **Favourites Page (`/favourite`)**: Displays all favourited items with individual removal controls.
3. **"Add All To Cart"**: Merges all currently favourited products into `cartStore`, updates the cart badge, and navigates directly to `/cart`.

### D. Cart & Checkout Flow
1. **My Cart (`/cart`)**: Displays line items, quantity steppers, item removal, dynamic price totals, and "Go to Checkout" CTA.
2. **Checkout Modal (Screen 20/22)**: Bottom sheet modal presented directly over the cart:
   - **Delivery Method**: Interactive selection (`Standard ($2.00)`, `Express ($4.50)`, `Pickup ($0.00)`).
   - **Payment Method**: Mutually exclusive selection (`Mastercard / Card`, `Cash on Delivery`, `Mobile Banking`).
   - **Promo Code**: Preset codes (`NECTAR10`, `GROCERY2`, `FREESHIP`) and custom code validator.
   - **Dynamic Total**: `Subtotal + Delivery Fee - Promo Discount = Final Cost`.
   - **Terms and Conditions**: Policy acknowledgement notice.
   - **Place Order**: Simulates placement, clears cart on success, and navigates to the result screen.

### E. Order Confirmation (Screen 22/22)
1. **Order Success (`/checkout/result?status=success`)**: Festive double-ring green checkmark with colorful confetti, "Your Order has been accepted" message, and "Track Order" / "Back to home" links.
2. **Order Failure (`/checkout/result?status=failed`)**: Modal error dialog with grocery bag illustration, "Oops! Order Failed" message, "Please Try Again" retry button (preserves cart for retry), and "Back to home" action.

### F. Account & Pending Checkout
1. **Account (`/account`)**: Displays authenticated user's name, email, delivery address, and quick links.
2. **Pending Checkout**: If the cart contains unfinished items, an actionable banner displays item count, total amount, and a **"Continue Checkout →"** button.

---

## 8. Search and Asynchronous Safety

When searching products asynchronously, network requests can resolve out of order. For example:
1. User types `"apple"` (Request A dispatched).
2. User quickly updates input to `"milk"` (Request B dispatched).
3. Request B resolves in 150ms; Request A resolves later in 400ms.

Without protection, Request A would overwrite the newer results of Request B with stale data.

---

## 9. Responsive Design & Desktop Adaptation

- **Mobile Viewport (375px - 430px)**: Faithful 1:1 reproduction of Figma screens, fixed bottom navigation bar, and bottom-sheet modals.
- **Desktop & Tablet Viewport (768px - 1920px)**:
  - Constrained centered container (`max-w-md` to `max-w-4xl`) avoiding distorted, full-bleed stretching.
  - Multi-column product grids expanding from 2 columns on mobile to 3–4 columns on larger screens.
  - Modals and filter drawers centered with backdrop blurs.

*For detailed rationale on layout adaptations, see [DESIGN_NOTES.md](file:///c:/Users/g/OneDrive/Documents/Ahoum%20Frontend-Development%20Assignment/DESIGN_NOTES.md).*

---

## 10. AI-Assisted Development & Engineering Review

This project was developed with AI-assisted tooling (Google Antigravity) paired with rigorous manual developer review, verification, and debugging.

### Engineering Oversight Process
1. **Prompt Specification**: Prompts were structured around individual Figma screen requirements.
2. **Code Review & Quality Audits**: All AI-generated changes were inspected for architectural compliance, state isolation, and asset preservation.
3. **Automated Verification**: `npm run typecheck` and `npm run build` were executed after every iteration.
4. **Manual Browser Testing**: Full end-to-end user flows were tested in responsive viewports.

### Real Examples of Issues Identified & Corrected
- **Image Mapping & Asset Regressions**: Early iterations caused missing image paths when generating search mock assets; resolved by standardizing canonical paths in `products.json` and verifying 100% of 31 image endpoints return HTTP 200.
- **Payment Selector Mutex Bug**: The Checkout payment drawer initially marked all payment options as `Selected` simultaneously; corrected by making payment selection strictly mutually exclusive and synchronizing the summary row.
- **Account Navigation Redirection**: The Account tab initially routed authenticated users back to the Login screen; corrected by making the Account tab state-aware and introducing the authenticated `AccountPage`.
- **Explore Filter Discovery Gap**: The Explore screen initially lacked access to the shared Filter modal; resolved by integrating `FilterModal` directly alongside Search Store.

*For complete logs, see [PROMPT_LOG.md](file:///c:/Users/g/OneDrive/Documents/Ahoum%20Frontend-Development%20Assignment/PROMPT_LOG.md), [DEBUGGING.md](file:///c:/Users/g/OneDrive/Documents/Ahoum%20Frontend-Development%20Assignment/DEBUGGING.md), and [DECISIONS.md](file:///c:/Users/g/OneDrive/Documents/Ahoum%20Frontend-Development%20Assignment/DECISIONS.md).*

---

## 11. Known Limitations

The following items are intentional architectural boundaries within the scope of this frontend assignment:

1. **Mock Asynchronous Data**: Product queries, search, and category loading are simulated via client-side mock services with artificial delays rather than a remote backend server.
2. **Simulated Checkout & Payments**: Payment methods (Mastercard, COD, Mobile Banking) and promo codes are simulated client-side without integration with payment gateways (e.g., Stripe, Razorpay).
3. **Session-Level Persistence**: User sessions, locations, and favourites are stored in memory via Zustand and reset upon full page reloads unless persisted to localStorage.
4. **Order Tracking**: The "Track Order" CTA redirects to the store home page because a dedicated live delivery map screen was not part of the required Figma screen bundle.

---

## 12. Future Improvements & Engineering Roadmap

With additional development time, the following enhancements would be prioritized:

1. **Backend & Database Integration**: Connect to a real Node.js / Go / Python backend with PostgreSQL for persistent user accounts, product catalogs, and order histories.
2. **Real Payment Gateway**: Integrate Stripe Elements or Apple Pay / Google Pay for PCI-compliant transaction processing.
3. **Automated Testing Suite**:
   - Unit & integration testing with **Vitest** and **React Testing Library** for Zustand stores, filter utilities, and custom hooks.
   - End-to-end testing with **Playwright** for complete Cart → Checkout → Confirmation user journeys.
4. **Live Inventory & WebSockets**: Implement real-time stock quantity updates and live courier tracking via WebSockets.
5. **Image Optimization Pipeline**: Serve WebP/AVIF responsive image formats with `srcset` via an image CDN (e.g., Cloudinary or Cloudflare Images).
6. **Progressive Web App (PWA)**: Add service workers for offline catalog browsing and push notifications for order updates.
