# Job Tracker App

A full-stack, production-grade Kanban application for tracking job applications built with Next.js 16 (App Router), React 19, MongoDB/Mongoose, Better Auth, and @dnd-kit.

---

## Architecture & Technical Decisions

### 1. Single Source of Truth
- **Relationship Ownership**: `JobApplication.columnId` and `JobApplication.order` are the sole source of truth for column membership and positioning.
- **Eliminated Dual-Link Drift**: The obsolete `Column.jobApplications[]` array was removed from the schema. This permanently eliminates orphaned ID references and null-dereference crashes on dashboard rendering.
- **Deterministic Sorting**: All job queries sort by `{ order: 1, _id: 1 }` ensuring strict, deterministic ordering across restarts and queries.

### 2. Ordering Invariant: Dense 0..n-1 via bulkWrite
- **Invariant**: Every column maintains a dense index sequence (`0..n-1`).
- **Self-Healing**: When cards are moved, reordered, or deleted, affected columns are compacted/re-indexed in atomic `bulkWrite` operations. Any potential gaps or duplicate orders are healed immediately upon the next mutation.
- **Atomic Creation**: Job creation calculates order inside the transaction, preventing concurrency duplicate order races.

### 3. Concurrency & Resilient Mutation Queue
- **Async Serialization**: `MutationQueue` properly awaits inner promises so server mutations run sequentially.
- **Fault-Tolerant Drain**: Queue consumption is wrapped in `try / catch / finally` so an individual network error never freezes subsequent mutations.
- **Per-Key Coalescing**: Rapid reorders on the same job are coalesced by `jobId`, collapsing intermediate drag movements into a single network payload.

### 4. API Contract, Transactions & IDOR Security
- **Discrete Verbs**: Replaced monolithic god actions with single-purpose server actions:
  - `createJobApplication`
  - `reorderColumnJobs`
  - `moveJobToColumn`
  - `updateJobFields` (strictly prohibited from modifying `columnId` or `order`)
  - `deleteJobApplication`
- **Validation**: Every action validates inputs with Zod schemas and returns typed, coded results (`{ success: true, data }` or `{ success: false, error: { code, message } }`).
- **Authorization**: Comprehensive ownership checks verify that the authenticated user owns both the board and the destination column before writing, eliminating Insecure Direct Object Reference (IDOR) vulnerabilities.
- **Transactions**: Multi-document operations run within MongoDB `session.withTransaction()`, with standalone fallback for local environments without replica sets.

### 5. Client State & Interaction Lifecycle
- **Pure Functions**: Board moves are calculated via the pure, tested `computeBoardMove()` function using `@dnd-kit/sortable`'s `arrayMove` to eliminate off-by-one reorder errors.
- **Functional State Updates**: State transitions use `setBoard(prev => ...)`, completely eliminating stale closure races during rapid drags.
- **Lifecycle Completeness**: `onDragCancel` (e.g. Escape key) cleanly resets optimistic state to baseline.
- **Dedicated Drag Handles**: Drag listeners are bound to a dedicated `GripVertical` handle, allowing cards to be clicked and expanded without fighting dnd listeners or requiring `stopPropagation` workarounds.
- **Presentational DragOverlay**: `DragOverlay` renders a dumb, presentational card without sortable hooks, preventing duplicate element registrations.

### 6. Next.js Boundaries & Auth
- **Lazy Auth Connection**: Eliminated top-level database `await` in `lib/auth/auth.ts` using lazy initialization and proxying to prevent build-time crashes and reduce request latency.
- **Proxy Matchers**: `proxy.ts` is explicitly configured with route matchers (`/dashboard/:path*`, `/sign-in`, `/sign-up`) and guards protected dashboard routes.
- **Client Navigation**: Clean client-side routing via Next.js `useRouter().push()` in interactive event handlers.

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB instance (local or MongoDB Atlas URI)

### Environment Variables
Configure `.env`:
```env
MONGODB_URI="mongodb://localhost:27017/job-tracker"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
USER_ID="optional-default-user-id"
```

### Available Scripts

- **Development Server**:
  ```bash
  npm run dev
  ```
- **Type-Aware Linting** (0 errors, 0 warnings):
  ```bash
  npm run lint
  ```
- **Run Tests** (Vitest):
  ```bash
  npm test
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Repair Order Invariants**:
  ```bash
  npm run repair-orders
  ```
- **Database Seed**:
  ```bash
  npm run seed
  ```
