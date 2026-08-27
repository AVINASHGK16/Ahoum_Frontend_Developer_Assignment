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

