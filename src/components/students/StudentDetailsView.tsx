"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DeleteConfirmModal } from "@/components/students/DeleteConfirmModal";
import { ErrorState } from "@/components/students/ErrorState";
import { LoadingState } from "@/components/students/LoadingState";
import { StudentForm } from "@/components/students/StudentForm";
import { Toast } from "@/components/ui/Toast";
import type { Student, StudentInput } from "@/types/student";

export function StudentDetailsView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState<
    Record<string, string>
  >({});

  const dismissToast = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  async function loadStudent() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${id}`);
      if (response.status === 404) {
        setError("Student not found.");
        setStudent(null);
        return;
      }
      if (!response.ok) {
        setError("Unable to load student. Please try again.");
        setStudent(null);
        return;
      }

      const data = (await response.json()) as Student;
      setStudent(data);
    } catch {
      setError("Unable to load student. Please try again.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUpdate(values: StudentInput) {
    setSaving(true);
    setFormServerErrors({});
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (body?.details) {
          setFormServerErrors(body.details);
        }
        setError(body?.message || "Unable to update student.");
        return false;
      }

      setStudent(body as Student);
      setEditing(false);
      setSuccessMessage("Student updated successfully.");
      setError(null);
      return true;
    } catch {
      setError("Unable to update student.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.message || "Unable to delete student.");
        setConfirmDelete(false);
        return;
      }
      router.push("/");
    } catch {
      setError("Unable to delete student.");
      setConfirmDelete(false);
    } finally {
      setSaving(false);
    }
  }

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
        <ErrorState message={error} onRetry={loadStudent} />
      </div>
    );
  }

  if (!student) return null;

  const toastOpen = Boolean(successMessage) || Boolean(error);
  const toastMessage = successMessage || error || "";
  const toastVariant = successMessage ? "success" : "error";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={dismissToast}
      />

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
              onClick={() => {
                setEditing((prev) => !prev);
                setFormServerErrors({});
                setError(null);
              }}
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
            onCancel={() => setEditing(false)}
            onSubmit={handleUpdate}
          />
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Phone</dt>
              <dd className="mt-1 font-medium text-slate-900">{student.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Class</dt>
              <dd className="mt-1 font-medium text-slate-900">{student.class}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Status</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {student.status === "ACTIVE" ? "Active" : "Inactive"}
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
          void handleDelete();
        }}
      />
    </div>
  );
}
