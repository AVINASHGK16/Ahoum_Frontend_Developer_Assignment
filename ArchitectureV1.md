                    ┌──────────────────────┐
                    │      React App       │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │       Pages          │
                    │ Home / Category /    │
                    │ Product / Search /   │
                    │ Cart / Checkout      │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    Components        │
                    │ presentation + UX    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │ Hooks / UI Logic     │
                    └──────┬─────────┬─────┘
                           │         │
                ┌──────────▼───┐ ┌──▼────────────┐
                │   Mock API   │ │ Zustand       │
                │              │ │ Global State  │
                └──────┬───────┘ └───────────────┘
                       │
                ┌──────▼───────┐
                │ Static JSON  │
                └──────────────┘

## Architecture Boundaries

- Pages are responsible for screen composition and route-level concerns.
- Components are responsible for presentation and user interaction.
- Hooks are used only where reusable UI-facing or asynchronous logic is justified.
- Zustand stores contain only state that must be shared across independent parts of the application.
- The mock API is the application's data-access boundary and is responsible for simulated latency and controlled request failures.
- Static JSON is treated as the mock backend dataset and is not accessed directly by UI components.
- Utility functions remain pure where possible and contain domain-independent or reusable logic.


Ahoum Frontend Developer Assignment/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── CartPage.tsx
│   │   └── CheckoutResultPage.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── search/
│   │   ├── cart/
│   │   └── feedback/
│   │
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   └── useSearch.ts
│   │
│   ├── stores/
│   │   ├── cartStore.ts
│   │   └── sessionStore.ts
│   │
│   ├── services/
│   │   └── mockApi/
│   │       ├── productsApi.ts
│   │       ├── categoriesApi.ts
│   │       └── searchApi.ts
│   │
│   ├── data/
│   │   ├── products.json
│   │   └── categories.json
│   │
│   ├── types/
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   └── utils/
│       ├── cartValidation.ts
│       └── formatters.ts
│
├── DESIGN_NOTES.md
├── DECISIONS.md
├── DEBUGGING.md
├── PROMPT_LOG.md
├── README.md
│
├── package.json
├── tsconfig.json
└── vite.config.ts