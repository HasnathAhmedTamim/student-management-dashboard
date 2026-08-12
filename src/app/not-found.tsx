import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        EduAyna
      </p>
      <h1 className="mt-2 text-5xl font-bold text-slate-900">404</h1>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        Page not found
      </h2>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
      >
        Back to students
      </Link>
    </div>
  );
}
