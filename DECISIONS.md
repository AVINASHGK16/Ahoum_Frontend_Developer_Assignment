# Decision 001 — Proceeding with an Internally Defined Visual System While Awaiting the Figma

### Problem

The assignment identifies the provided Figma design as the primary visual reference for the frontend implementation. However, the Figma was not included in the assignment document available to me, and I have not yet received the design separately. I have contacted the coordinators to request access to the Figma.

Since the assignment has a 24-hour deadline, waiting for the Figma before beginning implementation would unnecessarily delay work on the parts of the system that are independent of the visual reference.

### Options Considered

1. **Wait for the official Figma before beginning implementation.**

   * This would ensure that all UI decisions are based on the intended reference.
   * However, it would leave limited time for implementing, testing, debugging, and documenting the required engineering challenges.

2. **Proceed by making undocumented visual assumptions.**

   * This would allow development to start immediately.
   * However, undocumented assumptions could make later visual corrections more difficult and would provide little evidence of deliberate design reasoning.

3. **Define a documented, mobile-first visual system and proceed while remaining prepared to adapt it to the official Figma.**

   * This allows development of the application and its engineering requirements to proceed without unnecessarily blocking on the unavailable reference.
   * The visual decisions can be revised if the official Figma becomes available.

### Decision

I have chosen **Option 3**.

I will proceed with a coherent, internally defined mobile-first visual system based on the functional requirements provided in the assignment. The system will be designed to support the required catalog, category/product listing, product detail, search, cart, and checkout flows, along with the required responsive desktop adaptation.

If the official Figma becomes available during the implementation period, it will become the primary visual reference and the relevant UI decisions will be adjusted accordingly.

### Rationale

The 24-hour deadline makes it important to make progress on requirements that do not depend on the missing visual reference. Architecture, TypeScript configuration, Zustand state management, mock API behavior, asynchronous search handling, persisted-cart consistency, error handling, accessibility, testing, and project documentation can all be developed independently.

This approach allows me to use the available time effectively while keeping the implementation adaptable rather than treating the temporary visual system as a replacement for the official Figma.

### Trade-off

The primary trade-off is that visual fidelity to the intended Figma design cannot currently be guaranteed.

To manage this risk, visual decisions will be kept deliberate and documented, while the application architecture will avoid unnecessary coupling between the visual implementation and the underlying state, data, and asynchronous behavior. This should make later visual adjustments more manageable if the official Figma is provided.

Decision 002 — Separate UI, data access, and state responsibilities

Decision: Keep React components, mock API access, Zustand state, and static data in separate layers.

Reason: The assignment tests asynchronous behavior and persisted state consistency. Separating these responsibilities allows those behaviors to be implemented and tested without tightly coupling them to individual UI components.

Trade-off: This introduces more files than putting API calls directly inside pages, but it makes asynchronous behavior, state ownership, and debugging clearer.

Implementation:

Pages / Components
    ↓
Hooks / Application logic
    ↓
Mock API
    ↓
JSON data

Global cross-page state
    ↓
Zustand stores