# Design Notes

## Decision 1 — Mobile-first hierarchy

**Decision:** Prioritize product discovery, search, category navigation and
add-to-cart actions on small screens.

**Reason:** The assignment describes the source design as mobile-first, so the
mobile layout establishes the information hierarchy rather than treating
desktop as the starting point.

---

## Decision 2 — Desktop uses structural adaptation

**Decision:** Desktop will use a centered max-width container, multi-column
product grid, expanded category/filter treatment and dedicated cart/checkout
layout.

**Reason:** The assignment requires desktop to be a thoughtful adaptation rather
than a stretched mobile layout, including at least four product columns where
space permits.

---

## Decision 3 — Figma-Derived Visual System

**Decision:** Use the official Figma as the source of truth for visual tokens and
screen-level UI decisions.

The implementation should derive:
- colors
- typography
- spacing
- border/radius treatment
- component proportions
- imagery
- responsive behavior
- interaction states

from the provided design.

The existing component architecture should be reused where possible rather
than recreating equivalent UI independently for each screen.

# Figma Implementation 

## Screen 1 — Nectar Splash Screen

- Full-screen Nectar green background.
- Centered Nectar logo and wordmark.
- Minimal presentation with no application shell.
- Acts as the initial entry screen.

## Screen 2 — Welcome to Our Store

- Full-screen photographic background.
- Delivery person carrying groceries is the primary visual.
- Darkened photographic area provides contrast for foreground content.
- White Nectar carrot mark appears above the heading.
- Large white two-line heading:
  "Welcome"
  "to our store"
- Supporting text:
  "Get your groceries in as fast as one hour"
- Green primary CTA:
  "Get Started"
- Screen is designed as a mobile-first composition.
- No application header or bottom navigation is present.

## Implementation Notes

The photographic background is represented locally in
`public/images/welcome-bg.jpg` so the application does not depend on an
external runtime image URL.

The image was generated to reproduce the visual characteristics of the
provided Figma reference. It should be visually compared against the
reference during final QA.

---

## Account Page — Responsive Application Destination

The Account screen follows the application's existing mobile-first navigation pattern.

On mobile, Account remains accessible through the persistent bottom navigation and presents user information and relevant shopping state in a focused vertical layout.

On larger screens, the Account content can occupy a constrained max-width content area rather than stretching across the viewport.

The design prioritizes user identity and actionable state over adding unnecessary account-management sections that are not represented by the current application requirements.

---

## Explore Filter — Shared Filtering Entry Point

The Explore screen now exposes the existing Filter capability alongside Search.

The Filter interaction retains the established Categories / Brands separation rather than introducing a different Explore-specific filtering UI.

On desktop, the Filter control remains associated with the search/discovery controls while the resulting products use the existing responsive product-grid treatment.

This keeps filtering discoverable without disrupting the existing category-discovery hierarchy.