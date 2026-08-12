"use client";

import { Modal } from "@/components/ui/Modal";
import { StudentForm } from "@/features/students/components/StudentForm";
import type { Student, StudentInput } from "@/features/students/types/student";

export type StudentUpsertMode = "create" | "edit";

interface StudentUpsertModalProps {
  open: boolean;
  mode: StudentUpsertMode;
  initialValues: Student | null;
  submitting: boolean;
  serverErrors: Record<string, string>;
  onCancel: () => void;
  onSubmit: (values: StudentInput) => Promise<boolean> | boolean;
}

export function StudentUpsertModal({
  open,
  mode,
  initialValues,
  submitting,
  serverErrors,
  onCancel,
  onSubmit,
}: StudentUpsertModalProps) {
  return (
    <Modal
      open={open}
      title={mode === "create" ? "Add Student" : "Edit Student"}
      onClose={submitting ? undefined : onCancel}
      overlayClassName="z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      cardClassName="max-h-[90vh] max-w-lg overflow-y-auto"
      footer={undefined}
    >
      <StudentForm
        key={`${mode}-${initialValues?.id ?? "new"}`}
        mode={mode}
        initialValues={initialValues}
        submitting={submitting}
        serverErrors={serverErrors}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}

