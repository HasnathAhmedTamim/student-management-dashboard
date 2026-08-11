"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DeleteConfirmModal } from "@/components/students/DeleteConfirmModal";
import { EmptyState } from "@/components/students/EmptyState";
import { ErrorState } from "@/components/students/ErrorState";
import { LoadingState } from "@/components/students/LoadingState";
import { Pagination } from "@/components/students/Pagination";
import { StudentFiltersBar } from "@/components/students/StudentFilters";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentTable } from "@/components/students/StudentTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearMessages,
  createStudent,
  deleteStudent,
  fetchStudents,
  setPage,
  updateStudent,
} from "@/store/studentsSlice";
import type { Student, StudentInput } from "@/types/student";

type PanelMode = "closed" | "create" | "edit";

export function StudentsDashboard() {
  const dispatch = useAppDispatch();
  const { items, meta, loading, saving, error, successMessage, filters } =
    useAppSelector((state) => state.students);

  const [panelMode, setPanelMode] = useState<PanelMode>("closed");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [formServerErrors, setFormServerErrors] = useState<
    Record<string, string>
  >({});

  const loadStudents = useCallback(() => {
    void dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      dispatch(clearMessages());
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  function openCreate() {
    setSelectedStudent(null);
    setFormServerErrors({});
    setPanelMode("create");
    dispatch(clearMessages());
  }

  function openEdit(student: Student) {
    setSelectedStudent(student);
    setFormServerErrors({});
    setPanelMode("edit");
    dispatch(clearMessages());
  }

  function closePanel() {
    setPanelMode("closed");
    setSelectedStudent(null);
    setFormServerErrors({});
  }

  async function handleCreate(values: StudentInput) {
    const result = await dispatch(createStudent(values));
    if (createStudent.fulfilled.match(result)) {
      closePanel();
      loadStudents();
      return true;
    }

    const payload = result.payload as
      | { message?: string; details?: Record<string, string> }
      | undefined;
    if (payload?.details) {
      setFormServerErrors(payload.details);
    }
    return false;
  }

  async function handleUpdate(values: StudentInput) {
    if (!selectedStudent) return false;

    const result = await dispatch(
      updateStudent({ id: selectedStudent.id, data: values }),
    );

    if (updateStudent.fulfilled.match(result)) {
      closePanel();
      return true;
    }

    const payload = result.payload as
      | { message?: string; details?: Record<string, string> }
      | undefined;
    if (payload?.details) {
      setFormServerErrors(payload.details);
    }
    return false;
  }

  async function handleDeleteConfirm() {
    if (!studentToDelete) return;

    const result = await dispatch(deleteStudent(studentToDelete.id));
    if (deleteStudent.fulfilled.match(result)) {
      setStudentToDelete(null);

      const remainingOnPage = items.length - 1;
      if (remainingOnPage === 0 && filters.page > 1) {
        dispatch(setPage(filters.page - 1));
      }
      loadStudents();
    }
  }

  function handlePageChange(page: number) {
    dispatch(setPage(page));
    void dispatch(fetchStudents());
  }

  const showTable = !loading && !error && items.length > 0;
  const showEmpty = !loading && !error && items.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            EduAyna
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Student Management
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            View, search, filter, sort, add, edit, and delete students from one
            dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/docs"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            API Docs
          </Link>
          <LogoutButton />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
          >
            Add Student
          </button>
        </div>
      </header>

      {successMessage ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      {error && !loading ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mb-4">
        <StudentFiltersBar onFilterChange={loadStudents} />
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && error && items.length === 0 ? (
        <ErrorState message={error} onRetry={loadStudents} />
      ) : null}
      {showEmpty ? <EmptyState /> : null}
      {showTable ? (
        <>
          <StudentTable
            students={items}
            onEdit={openEdit}
            onDelete={setStudentToDelete}
          />
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            disabled={loading || saving}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}

      {panelMode !== "closed" ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {panelMode === "create" ? "Add Student" : "Edit Student"}
            </h2>
            <StudentForm
              mode={panelMode === "create" ? "create" : "edit"}
              initialValues={panelMode === "edit" ? selectedStudent : null}
              submitting={saving}
              serverErrors={formServerErrors}
              onCancel={closePanel}
              onSubmit={panelMode === "create" ? handleCreate : handleUpdate}
            />
          </div>
        </div>
      ) : null}

      <DeleteConfirmModal
        open={Boolean(studentToDelete)}
        studentName={studentToDelete?.name ?? ""}
        loading={saving}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </div>
  );
}
