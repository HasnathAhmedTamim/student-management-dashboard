"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  if (total === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-900">{page}</span> of{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
        <span className="mx-2 text-slate-300">·</span>
        {total} student{total === 1 ? "" : "s"}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-9 rounded-lg px-2.5 py-1.5 text-sm font-medium ${
              pageNumber === page
                ? "bg-teal-700 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
