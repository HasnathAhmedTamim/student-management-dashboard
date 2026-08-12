"use client";

import Link from "next/link";
import type { Student } from "@/features/students/types/student";

type StudentActionsVariant = "desktop" | "mobile";

interface StudentActionsProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  variant: StudentActionsVariant;
}

export function StudentActions({
  student,
  onEdit,
  onDelete,
  variant,
}: StudentActionsProps) {
  if (variant === "mobile") {
    return (
      <div className="mt-4 flex gap-2">
        <Link
          href={`/students/${student.id}`}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
        >
          View
        </Link>
        <button
          type="button"
          onClick={() => onEdit(student)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(student)}
          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/students/${student.id}`}
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700"
      >
        View
      </Link>
      <button
        type="button"
        onClick={() => onEdit(student)}
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(student)}
        className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700"
      >
        Delete
      </button>
    </div>
  );
}

