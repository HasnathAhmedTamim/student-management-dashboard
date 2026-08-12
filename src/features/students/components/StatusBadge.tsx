import type { StudentStatus } from "@/features/students/types/student";

export function StatusBadge({ status }: { status: StudentStatus }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
