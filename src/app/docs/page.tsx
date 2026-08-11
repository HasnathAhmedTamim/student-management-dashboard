import Link from "next/link";

const endpoints = [
  {
    method: "GET",
    path: "/api/students",
    description:
      "List students with search, status/class filters, sorting, and pagination.",
  },
  {
    method: "POST",
    path: "/api/students",
    description: "Create a student. Returns 201 on success.",
  },
  {
    method: "GET",
    path: "/api/students/:id",
    description: "Get a single student by id.",
  },
  {
    method: "PATCH",
    path: "/api/students/:id",
    description: "Update an existing student.",
  },
  {
    method: "DELETE",
    path: "/api/students/:id",
    description: "Delete a student.",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Login and set session cookie.",
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    description: "Clear session cookie.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm font-medium text-teal-700 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">API Documentation</h1>
      <p className="mt-2 text-slate-600">
        OpenAPI 3 specification is available at{" "}
        <a href="/openapi.json" className="text-teal-700 hover:underline">
          /openapi.json
        </a>{" "}
        and{" "}
        <a href="/api/openapi" className="text-teal-700 hover:underline">
          /api/openapi
        </a>
        .
      </p>

      <div className="mt-8 space-y-3">
        {endpoints.map((endpoint) => (
          <article
            key={`${endpoint.method}-${endpoint.path}`}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="font-mono text-sm">
              <span className="mr-2 rounded bg-teal-100 px-2 py-0.5 font-semibold text-teal-800">
                {endpoint.method}
              </span>
              {endpoint.path}
            </p>
            <p className="mt-2 text-sm text-slate-600">{endpoint.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
