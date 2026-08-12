"use client";

import Link from "next/link";
import { DeleteConfirmModal } from "@/features/students/components/DeleteConfirmModal";
import { ErrorState } from "@/features/students/components/ErrorState";
import { LoadingState } from "@/features/students/components/LoadingState";
import { StatusBadge } from "@/features/students/components/StatusBadge";
import { StudentForm } from "@/features/students/components/StudentForm";
import { useStudentDetails } from "@/features/students/hooks/useStudentDetails";

export function StudentDetailsView() {
  const {
    student,
    loading,
    saving,
    error,
    editing,
    confirmDelete,
    formServerErrors,
    retryLoad,
    toggleEditing,
    stopEditing,
    setConfirmDelete,
    updateCurrentStudent,
    deleteCurrentStudent,
  } = useStudentDetails();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <LoadingState message="Loading student..." />
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-teal-700 hover:underline"
        >
          ← Back to students
        </Link>
        <ErrorState message={error} onRetry={retryLoad} />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-medium text-teal-700 hover:underline"
      >
        ← Back to students
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Student details
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {student.name}
            </h1>
            <p className="mt-2 text-slate-600">{student.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleEditing}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {editing ? "Cancel edit" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {editing ? (
          <StudentForm
            mode="edit"
            initialValues={student}
            submitting={saving}
            serverErrors={formServerErrors}
            onCancel={stopEditing}
            onSubmit={updateCurrentStudent}
          />
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Phone</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {student.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Class</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {student.class}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={student.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Created at</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {new Date(student.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-slate-500">Student ID</dt>
              <dd className="mt-1 break-all font-mono text-sm text-slate-700">
                {student.id}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <DeleteConfirmModal
        open={confirmDelete}
        studentName={student.name}
        loading={saving}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          void deleteCurrentStudent();
        }}
      />
    </div>
  );
}
