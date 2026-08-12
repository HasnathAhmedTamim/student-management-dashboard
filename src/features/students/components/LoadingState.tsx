"use client";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading students...",
}: LoadingStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-600">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
      <p>{message}</p>
    </div>
  );
}
