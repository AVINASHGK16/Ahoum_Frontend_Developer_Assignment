Decision 1 — Mobile-first hierarchy

Decision: Prioritize product discovery, search, category navigation and add-to-cart actions on small screens.

Reason: The assignment explicitly describes the source design as mobile-first, so the mobile layout should establish the information hierarchy rather than treating desktop as the starting point.

Decision 2 — Desktop uses structural adaptation

Decision: Desktop will use a centered max-width container, multi-column product grid, expanded category/filter treatment and dedicated cart/checkout layout.

Reason: The assignment explicitly requires desktop to be a thoughtful adaptation rather than a stretched mobile layout, including at least four product columns where space permits.

Decision 3 — Provisional visual tokens

Decision: Use a small internally-defined token system for spacing, typography, surfaces, borders, radii and interaction states until the official Figma becomes available.

Reason: This prevents inconsistent styling across screens while avoiding excessive coupling between the implementation and an assumed visual design.

Trade-off: The interim visual system may differ from the eventual Figma. Keeping styling centralized and component-based reduces the cost of adapting it later.