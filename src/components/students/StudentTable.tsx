"use client";

import Link from "next/link";
import type { Student } from "@/types/student";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function StatusBadge({ status }: { status: Student["status"] }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function StudentTable({
  students,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:text-teal-700 hover:underline"
                    >
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{student.email}</td>
                  <td className="px-4 py-3 text-slate-600">{student.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{student.class}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/students/${student.id}`}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(student)}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(student)}
                        className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {students.map((student) => (
          <article
            key={student.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/students/${student.id}`}
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  {student.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{student.email}</p>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="text-slate-800">{student.phone}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Class</dt>
                <dd className="text-slate-800">{student.class}</dd>
              </div>
            </dl>
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
          </article>
        ))}
      </div>
    </>
  );
}
