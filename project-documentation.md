# Job Tracker App - Project Documentation

## 1. Project Overview

**Name:** Job Tracker App  
**Purpose:** A productivity tool designed to help users visually track and manage their job applications throughout the hiring process.  
**Primary Domain:** Career Management & Productivity.  

The application provides a seamless, drag-and-drop Kanban board interface where users can organize applications by status (e.g., Wish List, Applied, Interviewing, Offer, Rejected), record details, and update them as they progress.

---

## 2. Feature Extraction

### 2.1 User Authentication
*   **Description:** Secure account creation, login, and session management.
*   **User Flow:** Users navigate to `/sign-in` or `/sign-up`. Upon successful registration, the database automatically initializes a default Kanban board with pre-defined columns for the new user.
*   **Implementation:** 
    *   **Library:** `better-auth` with a MongoDB adapter.
    *   **Key Files:** `lib/auth/auth.ts`, `app/sign-in`, `app/sign-up`.
    *   **Logic:** Uses `databaseHooks` on user creation to trigger `initUserBoard` (`lib/init_user_board.ts`).

### 2.2 Kanban Board Dashboard
*   **Description:** The core view where users see their job applications categorized in vertical columns.
*   **User Flow:** Authenticated users visit `/dashboard`. The server fetches their specific `Board` document, including populated `Columns` and `JobApplications`. 
*   **Implementation:** 
    *   **Key Files:** `app/dashboard/page.tsx`, `components/KanbanBoard.tsx`.
    *   **Logic:** A server component fetches the data and passes it to the client-side `KanbanBoard` component.

### 2.3 Drag-and-Drop Job Management
*   **Description:** Users can drag job cards to reorder them within a column or move them to different columns (updating their status).
*   **User Flow:** The user clicks and drags a job card. The UI optimistically updates the board's state instantly. In the background, the server is notified to update the job's `columnId` and relative `order`.
*   **Implementation:** 
    *   **Libraries:** `@dnd-kit/core`, `@dnd-kit/sortable`.
    *   **Key Files:** `hooks/useBoard.ts`, `components/KanbanBoard.tsx`, `lib/mutationQueue.ts`.
    *   **Logic:** `useBoard` handles complex local state mutation to prevent UI lag. A `mutationQueue` ensures sequential server updates via the `updateJobApplication` Server Action.

### 2.4 Add, Edit, and Delete Job Applications
*   **Description:** Full CRUD capabilities for individual job applications.
*   **User Flow:** 
    *   *Add:* Click "Add Job" or the "+" icon in a column header. Fill out a modal form (Company, Position, Salary, Tags, etc.) and submit.
    *   *Edit/Delete:* Click the three-dot ellipsis menu on a job card, select "Edit" to modify details or "Delete" to remove it permanently.
*   **Implementation:** 
    *   **Key Files:** `components/ui/JobApplication.tsx`, `actions/jobApplication.ts`.
    *   **Logic:** Client-side forms trigger Next.js Server Actions which mutate the MongoDB collections and call `revalidatePath("/dashboard")` to refresh the UI.

---

## 3. Developer Details

### Development Philosophy
*   **Server-Centric Logic:** Heavy utilization of Next.js Server Actions (`"use server"`) to bypass traditional REST API routes, directly connecting client interactions to database operations.
*   **Optimistic UI:** The drag-and-drop system prioritizes immediate user feedback by mutating local state before confirming with the server.
*   **Component-Driven UI:** Extensive use of atomic, reusable UI components built with `radix-ui` and `shadcn`, styled via Tailwind CSS v4.

### Key Technical Decisions & Trade-offs
*   **MongoDB + Mongoose:** Chosen over relational databases (like PostgreSQL) to easily accommodate flexible schemas and handle nested relationships (e.g., maintaining ordered arrays of `jobApplication` IDs inside `Column` documents).
*   **`better-auth`:** Selected likely for its highly customizable database hooks, allowing the developer to effortlessly tie board initialization to the user creation lifecycle event.
*   **Custom State & Mutation Queue:** Instead of Redux, the developer used a custom React hook (`useBoard.ts`) and a `mutationQueue` to resolve potential race conditions when rapidly dragging items.

### Documented Gotchas & Notes
*   **Complex Sorting Logic:** Inside `actions/jobApplication.ts`, there are detailed, multi-step developer comments outlining the logic for reordering items (e.g., distinguishing between dragging up/down in the same column vs. moving to a new column).
*   **Experimental Caching:** `dashboard/page.tsx` uses the `"use cache"` directive, which is an experimental Next.js feature for aggressive caching.
*   **Environment Variables:** Requires `MONGODB_URI` and likely authentication secrets in a `.env` file to function.

---

## 4. Architecture & Dependencies

### Core Stack
*   **Framework:** Next.js 16.1.6 (App Router)
*   **UI Library:** React 19, Tailwind CSS v4, `shadcn/ui`, `lucide-react`
*   **Database:** MongoDB, `mongoose` 9.2.4
*   **Authentication:** `better-auth` 1.5.4
*   **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`

### High-Level Component Diagram
```mermaid
flowchart TD
    User([User / Browser])
    
    subgraph Frontend [Next.js Client Components]
        DashboardUI[Dashboard UI]
        KanbanBoard[Kanban Board (Dnd-kit)]
        JobCard[Job Application Card]
        StateHook[useBoard (Local State)]
        Queue[Mutation Queue]
    end
    
    subgraph Backend [Next.js Server]
        Auth[better-auth API]
        DashboardRSC[Dashboard RSC]
        ServerActions[Server Actions: jobApplication.ts]
        DBConnection[lib/db.tsx]
    end
    
    subgraph Database [MongoDB]
        Users[(Users)]
        Boards[(Boards)]
        Columns[(Columns)]
        Jobs[(Job Applications)]
    end

    User <--> Auth
    User --> DashboardRSC
    DashboardRSC --> DashboardUI
    DashboardUI --> KanbanBoard
    KanbanBoard <--> StateHook
    StateHook --> Queue
    Queue --> ServerActions
    JobCard --> ServerActions
    
    Auth <--> Users
    DashboardRSC <--> DBConnection
    ServerActions <--> DBConnection
    DBConnection <--> Boards & Columns & Jobs
```

### Non-Obvious Abstractions
*   **`mutationQueue.ts`**: An abstraction meant to prevent overlapping database writes when a user drags multiple items quickly.
*   **`init_user_board.ts`**: An isolated script triggered by the Auth library to scaffold the initial database schema for a fresh user.

---

## 5. API / Interface Documentation

While the project does not use a traditional `/api` REST structure (aside from auth), its public interface is defined via **Server Actions**.

### `createJobApplication(job)`
*   **Location:** `actions/jobApplication.ts`
*   **Inputs:** `job` object omitting `_id`, `order`, and `userId` (which are inferred/calculated). Requires `company`, `position`, `columnId`, `boardId`, `status`.
*   **Outputs / Side Effects:** Validates authorization, verifies column and board ownership. Calculates the new `order` index, saves the `JobApplication` document, pushes the ID to the parent `Column`, and triggers `revalidatePath("/dashboard")`. Returns success message and data, or an error.

### `updateJobApplication(updates)`
*   **Location:** `actions/jobApplication.ts`
*   **Inputs:** `updates` object containing `jobId`, `columnId`, and an optional `order`. Can also include editable string fields (company, position, notes, etc.).
*   **Outputs / Side Effects:** A highly complex function that determines if the update is an edit, a same-column move, or a cross-column move. Adjusts the `order` integers of adjacent jobs accordingly. Updates documents and revalidates the dashboard. Returns `{ success: true }` or an error.

### `deleteJobApplication(jobId)`
*   **Location:** `actions/jobApplication.ts`
*   **Inputs:** `jobId` (string).
*   **Outputs / Side Effects:** Verifies ownership, removes the job ID from the parent `Column`'s array, deletes the `JobApplication` document, and revalidates the path.

### `getBoard(userID)`
*   **Location:** `app/dashboard/page.tsx`
*   **Inputs:** `userID` (string).
*   **Outputs:** Returns a deeply populated `Board` object (including columns and job applications). Uses Next.js caching.

---

## 6. Missing Info & Assumptions

### Explicit Assumptions
*   **Inferred Workflow:** It is assumed that the `mutationQueue` handles debouncing effectively, though without seeing its exact source code logic deeply, its efficiency is inferred from its usage in `KanbanBoard.tsx`.
*   **Data Validation:** Form validation relies largely on HTML `required` attributes and basic server-side null checks. It is assumed there is no complex schema validation library (like Zod) in place for user inputs.

### Human Verification Required
*   **"use cache" Stability:** The developer should verify that the experimental `"use cache"` directive in `dashboard/page.tsx` does not serve stale board data after a user creates or deletes a job on a different device.
*   **Error Handling:** Some server actions return `{ error: string }`, but the UI does not universally catch and display these errors (e.g., `handleMoveToNewColumn` in `JobApplication.tsx` does not alert the user if it fails). A developer should review global error handling.
*   **Orphaned Data:** A developer should verify that deleting a Column or a Board (if those features exist) properly cascades and deletes the child `JobApplication` documents to prevent database bloat.
