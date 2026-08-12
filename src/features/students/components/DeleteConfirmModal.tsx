"use client";

import { Modal } from "@/components/ui/Modal";

interface DeleteConfirmModalProps {
  studentName: string;
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  studentName,
  open,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      title="Delete student"
      overlayClassName="z-50 flex items-center justify-center bg-slate-900/50 p-4"
      cardClassName="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <p className="mt-3 text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-slate-900">{studentName}</span>? This
        action cannot be undone.
      </p>
    </Modal>
  );
}
