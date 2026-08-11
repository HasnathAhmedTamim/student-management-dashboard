# Student Management Dashboard (EduAyna Assignment)

A small fullstack Student Management Dashboard built for the FlyNest Global PLC / EduAyna junior fullstack evaluation.

Administrators can view, search, filter, create, update, and delete students. Data is stored in PostgreSQL (Neon) and exposed through Next.js API routes. Client state for the student list, filters, loading, and errors is managed with Redux Toolkit.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **State:** Redux Toolkit
- **Backend:** Next.js Route Handlers (`/api/students`)
- **Database:** PostgreSQL + Prisma ORM
- **Validation:** Zod (shared client/server rules)

## Requirements

- Node.js 18+ (recommended 20+)
- npm
- A PostgreSQL database (local or hosted, e.g. Neon)

## Installation

```bash
npm install
```

## Environment Variables

Copy the example file and set your database URL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Do **not** commit real credentials. `.env` is gitignored.

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

| Column     | Type                        |
|------------|-----------------------------|
| id         | UUID (PK)                   |
| name       | text                        |
| email      | text (unique)               |
| phone      | text                        |
| class      | text                        |
| status     | enum `ACTIVE` / `INACTIVE`  |
| created_at | timestamp                   |

## Running the Application

Development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/students` | List students (`search`, `status`, `class` query params) |
| `GET` | `/api/students/:id` | Get one student |
| `POST` | `/api/students` | Create student (`201`) |
| `PATCH` | `/api/students/:id` | Update student |
| `DELETE` | `/api/students/:id` | Delete student |

Status codes used: `200`, `201`, `400`, `404`, `500`.

## Project Structure

```text
src/
  app/
    api/students/          # REST API route handlers
    layout.tsx             # Root layout + Redux provider
    page.tsx               # Dashboard page
  components/students/     # UI: table, form, filters, states
  lib/                     # Prisma client, Zod validation, helpers
  store/                   # Redux store + students slice
  types/                   # Shared TypeScript types
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Implementation Notes

- **Redux** holds student list, loading/error/success, and filters/search.
- **Local React state** is used for form fields, modal open/close, and field-level validation messages.
- Search supports **name** and **email** (server-side) with a light debounce on the input.
- Add and Edit share one reusable `StudentForm` component.
- Delete requires confirmation before calling the API.
- Loading, empty, and error states are handled so the UI never goes blank.

## Short Explanation (Submission)

1. **Most challenging part?** Wiring Prisma 7 with Neon (driver adapter + pool) while keeping the API and Redux flow simple and reliable.
2. **Decision I’m most proud of?** Sharing Zod validation between the form and API so users and the server speak the same error language.
3. **If I had another 4 hours?** Add pagination, sorting, and a dedicated student details page.
4. **Before production?** Add authentication/authorization, stronger rate limiting and input sanitization, connection pooling tuned for serverless, automated tests, and rotate any exposed database credentials.

## License

Private assignment submission — not licensed for redistribution.
