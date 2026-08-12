# Student Management Dashboard (EduAyna Assignment)

A small fullstack Student Management Dashboard built for the FlyNest Global PLC / EduAyna junior fullstack evaluation.

Administrators can view, search, filter, sort, paginate, create, update, and delete students. The app includes a student details page, basic login, form validation, and toast notifications for feedback. Data is stored in PostgreSQL and exposed through Next.js API routes. Client state for the list, filters, and loading/error is managed with Redux Toolkit.

The codebase follows a **feature-based architecture**: see [Project Structure](#project-structure) for the folder map and the request flow.

**Repository:** https://github.com/HasnathAhmedTamim/student-management-dashboard  
**Live Demo:** https://student-management-dashboard-inky-kappa.vercel.app/

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- **State:** Redux Toolkit 2 + React Redux
- **Backend:** Next.js Route Handlers (`/api/students`, `/api/auth`)
- **Database:** PostgreSQL + Prisma ORM 7 (`@prisma/adapter-pg`)
- **Validation:** Zod 4 (shared client/server rules)
- **Notifications:** Sonner (toast popups)

## Requirements

- Node.js 20+ (required by Next.js 16)
- npm
- A PostgreSQL database (local or hosted, e.g. Neon)

## Installation

```bash
npm install
```

## Environment Variables

Copy the example file and configure values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
AUTH_SECRET="change-me-in-production"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_USERNAME` | No | Login username (default: `admin`) |
| `ADMIN_PASSWORD` | No | Login password (default: `admin123`) |
| `AUTH_SECRET` | No | Session token secret (change in production) |

Do **not** commit real credentials. `.env` is gitignored.

### Demo login

- Username: `admin`
- Password: `admin123`

## Database Setup

1. Ensure `DATABASE_URL` points to your PostgreSQL instance.
2. Apply migrations:

```bash
npx prisma migrate dev
```

3. (Optional) Seed sample students:

```bash
npm run db:seed
```

The schema creates a `students` table with:

| Column     | Type                       |
|------------|----------------------------|
| id         | UUID (PK)                  |
| name       | text                       |
| email      | text (unique)              |
| phone      | text                       |
| class      | text                       |
| status     | enum `ACTIVE` / `INACTIVE` |
| created_at | timestamp                  |

## Running the Application

Development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the demo credentials.

Production build:

```bash
npm run build
npm run start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Generate Prisma client and build the app |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample students |
| `npm run db:studio` | Open Prisma Studio |

### Code quality checks

Both of these pass with no warnings or errors:

```bash
npm run lint       # ESLint, including the React Hooks rules
npx tsc --noEmit   # TypeScript type check
npm run build      # Production build
```

## Live Demo / Deploy (Vercel)

**Live app:** https://student-management-dashboard-inky-kappa.vercel.app/

Demo login: `admin` / `admin123`

To redeploy or deploy your own copy:

1. Import the GitHub repository into [Vercel](https://vercel.com).
2. Add environment variables: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`.
3. Deploy.
4. Ensure Prisma migrations are already applied to the database (`npx prisma migrate deploy` locally against the same `DATABASE_URL` if needed).

## API Documentation

API behavior is documented in this README (no separate Swagger UI in the app).

### Auth

| Method | Path | Description | Status codes |
|--------|------|-------------|--------------|
| `POST` | `/api/auth/login` | Login with username/password; sets session cookie | `200`, `401`, `500` |
| `POST` | `/api/auth/logout` | Clear session cookie | `200` |
| `GET` | `/api/auth/me` | Check if current session is authenticated | `200` |

Login body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Protected routes require a valid session cookie. Unauthenticated API calls return `401`. Unauthenticated page visits redirect to `/login`.

### Students

| Method | Path | Description | Status codes |
|--------|------|-------------|--------------|
| `GET` | `/api/students` | List students (search, filters, sort, pagination) | `200`, `401`, `500` |
| `GET` | `/api/students/:id` | Get one student | `200`, `401`, `404`, `500` |
| `POST` | `/api/students` | Create student | `201`, `400`, `401`, `500` |
| `PATCH` | `/api/students/:id` | Update student | `200`, `400`, `401`, `404`, `500` |
| `DELETE` | `/api/students/:id` | Delete student | `200`, `401`, `404`, `500` |

#### `GET /api/students` query params

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `aisha` | Search by name or email |
| `status` | `ACTIVE` / `INACTIVE` | Filter by status |
| `class` | `Grade 10` | Filter by class |
| `sortBy` | `name` / `class` / `createdAt` | Sort field |
| `sortOrder` | `asc` / `desc` | Sort direction |
| `page` | `1` | Page number |
| `limit` | `5` | Page size (max 50) |

Example list response:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Aisha Rahman",
      "email": "aisha.rahman@example.com",
      "phone": "+8801711000001",
      "class": "Grade 10",
      "status": "ACTIVE",
      "createdAt": "2026-08-11T10:12:09.323Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 6,
    "totalPages": 2
  }
}
```

#### Create / update body

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "+8801712345678",
  "class": "Grade 10",
  "status": "ACTIVE"
}
```

### Validation rules

- **Name, email, phone, class, status:** required
- **Email:** must be a valid email format
- **Phone:** digits only (optional `+`, spaces, `-`, `()`), at least 8 digits
- Validation errors return `400` with field messages

Error responses use a consistent shape, and field errors are keyed by field name so the form can highlight the right input:

```json
{
  "message": "Invalid request.",
  "details": {
    "name": "Name is required.",
    "email": "Please enter a valid email address."
  }
}
```

Other error behavior:

| Case | Response |
|------|----------|
| Duplicate email | `400` with `details.email` |
| Malformed / non-JSON body | `400` (not a `500`) |
| Unknown student id | `404` `Student not found.` |
| No valid session cookie | `401` on API, redirect to `/login` on pages |
| `limit` above 50 | Clamped to 50 |
| Unknown `sortBy` / `sortOrder` | Falls back to `createdAt` / `desc` (sort fields are allow-listed) |

## Bonus Features

- Debounced search (750 ms)
- Pagination (`Previous / page numbers / Next`)
- Sorting by name, class, and created date
- Student details page at `/students/:id`
- Basic cookie-based admin authentication
- Custom 404 page for unknown URLs
- API documentation in this README
- Toast notifications (Sonner) for success/error feedback

## Project Structure

The project uses a **feature-based architecture**. Everything that belongs to the students feature (UI, hooks, API calls, Redux slice, types, validation) lives together under `src/features/students`, while genuinely shared code lives in `src/components`, `src/lib`, and `src/store`.

```text
student-management-dashboard/
├── prisma/
│   ├── schema.prisma                    # Student model + status enum (source of truth for the DB)
│   ├── migrations/                      # Versioned SQL migrations
│   └── seed.ts                          # Inserts sample students (npm run db:seed)
│
├── src/
│   ├── app/                             # Next.js App Router: routes and API only
│   │   ├── layout.tsx                   # Root layout: fonts, metadata, <Providers>
│   │   ├── providers.tsx                # Client wrapper: Redux store + toaster
│   │   ├── not-found.tsx                # Styled 404 page for unknown URLs
│   │   ├── globals.css                  # Tailwind entry + base styles
│   │   ├── (dashboard)/                 # Route group for signed-in pages
│   │   │   ├── page.tsx                 # "/" renders <StudentsDashboard />
│   │   │   └── students/[id]/page.tsx   # "/students/:id" renders <StudentDetailsView />
│   │   ├── (auth)/
│   │   │   └── login/page.tsx           # "/login" renders <LoginForm />
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts       # POST  validate credentials, set session cookie
│   │       │   ├── logout/route.ts      # POST  clear session cookie
│   │       │   └── me/route.ts          # GET   is the current session valid?
│   │       └── students/
│   │           ├── route.ts             # GET list (search/filter/sort/paginate), POST create
│   │           └── [id]/route.ts        # GET one, PATCH update, DELETE remove
│   │
│   ├── features/
│   │   └── students/                    # Everything about the students feature
│   │       ├── components/              # UI only: props in, markup out
│   │       │   ├── StudentsDashboard.tsx    # Page composition (header, filters, table, modals)
│   │       │   ├── StudentDetailsView.tsx   # Details page UI
│   │       │   ├── StudentFilters.tsx       # Debounced search + status/class/sort controls
│   │       │   ├── StudentTable.tsx         # Responsive table/card list
│   │       │   ├── StudentActions.tsx       # View / Edit / Delete buttons per row
│   │       │   ├── StudentForm.tsx          # Shared form for both Add and Edit
│   │       │   ├── StudentUpsertModal.tsx   # Wraps StudentForm in a create/edit modal
│   │       │   ├── DeleteConfirmModal.tsx   # "Are you sure?" before deleting
│   │       │   ├── StatusBadge.tsx          # Active/Inactive pill
│   │       │   ├── Pagination.tsx           # Previous / page numbers / Next
│   │       │   ├── LoadingState.tsx         # Skeleton while fetching
│   │       │   ├── EmptyState.tsx           # "No students found" message
│   │       │   └── ErrorState.tsx           # Error message + Retry button
│   │       ├── hooks/                   # Business logic, no markup
│   │       │   ├── useStudentCrud.ts        # Dashboard: create/update/delete/paginate + modals
│   │       │   ├── useStudentDetails.ts     # Details page: load/update/delete one student
│   │       │   └── useStudentsToasts.ts     # Turns Redux success/error into toasts
│   │       ├── services/                # All HTTP and data mapping
│   │       │   ├── students.api.ts          # fetch calls to /api/students (client side)
│   │       │   └── students.mapper.ts       # Prisma row -> API response shape (server side)
│   │       ├── store/
│   │       │   └── studentsSlice.ts         # Feature state, filters, and async thunks
│   │       ├── types/
│   │       │   └── student.ts               # Student, filters, pagination, response types
│   │       └── validations/
│   │           └── student.schema.ts        # Zod schema shared by client and server
│   │
│   ├── components/                      # Shared UI, not tied to one feature
│   │   ├── ui/
│   │   │   ├── Modal.tsx                # Reusable overlay + card used by both modals
│   │   │   └── AppToaster.tsx           # Sonner toast container
│   │   └── auth/
│   │       ├── LoginForm.tsx            # Credentials form, calls /api/auth/login
│   │       └── LogoutButton.tsx         # Calls /api/auth/logout, redirects to /login
│   │
│   ├── lib/                             # Shared helpers
│   │   ├── prisma.ts                    # Single Prisma client instance
│   │   ├── auth.ts                      # Session token create/verify, cookie name
│   │   ├── apiResponse.ts               # jsonOk / jsonError helpers for route handlers
│   │   ├── messages.ts                  # All user-facing success/error text in one place
│   │   └── utils.ts                     # Flash toast that survives a redirect
│   │
│   ├── store/                           # Shared Redux configuration
│   │   ├── index.ts                     # configureStore + store types
│   │   ├── rootReducer.ts               # Combines feature reducers
│   │   └── hooks.ts                     # Typed useAppDispatch / useAppSelector
│   │
│   └── middleware.ts                    # Auth gate: redirects pages, 401s API calls
│
├── .env.example                         # Template for required environment variables
├── prisma.config.ts                     # Prisma CLI config (schema + seed command)
├── next.config.ts                       # Next.js configuration
├── eslint.config.mjs                    # Lint rules
├── tsconfig.json                        # TypeScript config + "@/*" path alias
└── package.json                         # Scripts and dependencies
```

Route groups `(dashboard)` and `(auth)` only organize files; they do **not** change URLs. The routes are still `/`, `/login`, and `/students/:id`.

### How a request flows

1. A **component** (`StudentFilters`, `StudentActions`) calls a handler from a **hook** (`useStudentCrud`).
2. The hook dispatches a thunk in **`studentsSlice`**, which calls a function in **`services/students.api.ts`**.
3. That service calls the **API route**, which is guarded by **`middleware.ts`**, validated by the shared **Zod schema**, and reads or writes the database through **Prisma**.
4. The service returns `{ ok: true, data }` or `{ ok: false, error }`; the slice stores the result and **`useStudentsToasts`** shows the feedback toast.

Each layer has one job: components render, hooks decide, services talk HTTP, Redux stores shared state, and Zod validates on both sides.

## Implementation Notes / Additional Notes

- **Feature-based architecture:** the students feature owns its components, hooks, services, slice, types, and validation under `src/features/students`.
- **Components render, hooks decide, services fetch:** components hold no `fetch` calls, and hooks (`useStudentCrud`, `useStudentDetails`) hold no markup.
- Every request goes through `services/students.api.ts`, which returns a uniform `{ ok, data }` / `{ ok, error }` result so callers handle failures the same way.
- **Redux** holds student list, pagination meta, loading/error/success, filters, search, and sort.
- **Local React state** is used for form fields, modal open/close, and field-level validation messages.
- Search supports **name** and **email** (server-side) with debounce.
- Add and Edit share one reusable `StudentForm` component.
- Delete requires confirmation before calling the API.
- Loading, empty, and error UI states are handled so the screen never goes blank.
- Success/error action feedback uses **Sonner** toast popups.
- All user-facing messages live in `src/lib/messages.ts`, so the API, Redux, and UI never disagree on wording.
- The form resets between students via React's `key` prop instead of copying props into state inside an effect.
- After a create, update, or delete the list refetches, so filters and sort order stay correct.
- Auth is intentionally simple for the assignment demo (not production-ready).
- API docs are kept in the README instead of embedding Swagger UI in the app.
- Nest.js was not used; Next.js API routes keep the project simple and meet the backend requirement.

### Known limitations

- Demo auth only: the session token is derived from `AUTH_SECRET` with no expiry, the password is compared in plain text, and there is no rate limiting or user table.
- `GET /api/auth/me` exists for session checks but the UI relies on the middleware instead.
- No automated tests yet; verification was manual plus lint, type check, and build.
- Next.js 16 deprecates the `middleware.ts` convention in favour of `proxy.ts`; the auth gate still uses `middleware.ts`.

## Short Explanation (Submission)

1. **What was the most challenging part of the assignment?**  
   Combining pagination and sorting with Redux filters so the list stays consistent after create/delete, and wiring Prisma 7 with a hosted Postgres (Neon) connection.

2. **What technical decision are you most proud of?**  
   Sharing Zod validation between the form and API so the client and server use the same rules and error messages, and organising the code feature-first so each layer has one job (components render, hooks decide, services talk HTTP, Redux stores shared state).

3. **If you had another 4 hours, what would you improve?**  
   Stronger auth (hashed passwords, roles), automated tests for the services and slice, and server-side rendering of the details page so a missing student returns a real 404.

4. **What part of the application would you change before deploying it to production?**  
   Replace demo auth, rotate secrets, add rate limiting, add automated tests, and harden database access for serverless hosting.

## License

Private assignment submission — not licensed for redistribution.
