"use client";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { DeleteConfirmModal } from "@/features/students/components/DeleteConfirmModal";
import { EmptyState } from "@/features/students/components/EmptyState";
import { ErrorState } from "@/features/students/components/ErrorState";
import { LoadingState } from "@/features/students/components/LoadingState";
import { Pagination } from "@/features/students/components/Pagination";
import { StudentFilters } from "@/features/students/components/StudentFilters";
import { StudentTable } from "@/features/students/components/StudentTable";
import { StudentUpsertModal } from "@/features/students/components/StudentUpsertModal";
import { useStudentCrud } from "@/features/students/hooks/useStudentCrud";
import { useStudentsToasts } from "@/features/students/hooks/useStudentsToasts";

export function StudentsDashboard() {
  const {
    items,
    meta,
    loading,
    saving,
    error,
    successMessage,
    panelMode,
    selectedStudent,
    studentToDelete,
    formServerErrors,
    loadStudents,
    openCreate,
    openEdit,
    closePanel,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
    handlePageChange,
    setStudentToDelete,
  } = useStudentCrud();

  useStudentsToasts({
    successMessage,
    error,
    itemsLength: items.length,
  });

  const showTable = !loading && !error && items.length > 0;
  const showEmpty = !loading && !error && items.length === 0;
  const showLoadError = !loading && Boolean(error) && items.length === 0;

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
          <LogoutButton />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Add Student
          </button>
        </div>
      </header>

      <div className="mb-4">
        <StudentFilters onFilterChange={loadStudents} />
      </div>

      {loading ? <LoadingState /> : null}
      {showLoadError ? (
        <ErrorState message={error ?? undefined} onRetry={loadStudents} />
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
        <StudentUpsertModal
          open
          mode={panelMode}
          initialValues={panelMode === "edit" ? selectedStudent : null}
          submitting={saving}
          serverErrors={formServerErrors}
          onCancel={closePanel}
          onSubmit={panelMode === "create" ? handleCreate : handleUpdate}
        />
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
