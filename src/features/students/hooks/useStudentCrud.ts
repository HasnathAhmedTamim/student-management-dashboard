"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearMessages,
  createStudent,
  deleteStudent,
  fetchStudents,
  setPage,
  updateStudent,
} from "@/features/students/store/studentsSlice";
import type { ApiErrorPayload } from "@/features/students/services/students.api";
import type { Student, StudentInput } from "@/features/students/types/student";

type PanelMode = "closed" | "create" | "edit";

export function useStudentCrud() {
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

    const payload = result.payload as ApiErrorPayload | undefined;
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
      // Refetch so the row disappears/moves if it no longer matches the
      // active filters or sort order.
      loadStudents();
      return true;
    }

    const payload = result.payload as ApiErrorPayload | undefined;
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

  return {
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
  };
}
