# Student Management Dashboard (EduAyna Assignment)

A small fullstack Student Management Dashboard built for the FlyNest Global PLC / EduAyna junior fullstack evaluation.

Administrators can view, search, filter, sort, paginate, create, update, and delete students. Includes a student details page and basic login. Data is stored in PostgreSQL and exposed through Next.js API routes. Client state is managed with Redux Toolkit.

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

## API Documentation

API behavior is documented here (no separate Swagger UI in the app).

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

Protected routes require a valid session cookie. Unauthenticated API calls return `401`.

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
  "phone": "+8801XXXXXXXXX",
  "class": "Grade 10",
  "status": "ACTIVE"
}
```

Validation errors return `400` with field messages. Duplicate email returns `400`. Missing student returns `404`.

## Bonus Features

- Debounced search
- Pagination (`Previous / page numbers / Next`)
- Sorting by name, class, and created date
- Student details page at `/students/:id`
- Basic cookie-based admin authentication
- API documentation documented in this README

## Project Structure

```text
src/
  app/
    api/                   # REST API route handlers
    students/[id]/        # Student details page
    login/                 # Login page
    middleware.ts          # Auth gate
  components/
    auth/
    students/
  lib/
  store/
  types/
prisma/
```

## Implementation Notes

- **Redux** holds student list, pagination meta, loading/error/success, filters, search, and sort.
- **Local React state** is used for form fields, modal open/close, and field-level validation messages.
- Search supports **name** and **email** (server-side) with debounce.
- Add and Edit share one reusable `StudentForm` component.
- Delete requires confirmation before calling the API.
- Auth is intentionally simple for the assignment demo (not production-ready).
- API docs are kept in the README instead of embedding Swagger UI in the app.

## Short Explanation (Submission)

1. **Most challenging part?** Combining pagination/sorting with Redux filters so list updates stay consistent after create/delete.
2. **Decision I’m most proud of?** Sharing Zod validation between the form and API so users and the server speak the same error language.
3. **If I had another 4 hours?** Add stronger auth (hashed passwords, roles), automated tests, and optional Swagger UI.
4. **Before production?** Replace demo auth, rotate secrets, add rate limiting, automated tests, and harden database access for serverless.

## License

Private assignment submission — not licensed for redistribution.
