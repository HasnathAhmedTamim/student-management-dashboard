"use client";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No students found.",
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <p className="text-lg font-medium text-slate-800">{message}</p>
      <p className="mt-2 text-sm text-slate-500">
        Try adjusting your search or filters, or add a new student.
      </p>
    </div>
  );
}
