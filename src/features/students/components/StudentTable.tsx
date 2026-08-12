"use client";

import Link from "next/link";
import type { Student } from "@/features/students/types/student";
import { StudentActions } from "@/features/students/components/StudentActions";
import { StatusBadge } from "@/features/students/components/StatusBadge";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({
  students,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
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
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:underline"
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
                    <StudentActions
                      student={student}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      variant="desktop"
                    />
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
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/students/${student.id}`}
                  className="font-semibold text-slate-900 hover:underline"
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
            <StudentActions
              student={student}
              onEdit={onEdit}
              onDelete={onDelete}
              variant="mobile"
            />
          </article>
        ))}
      </div>
    </>
  );
}
