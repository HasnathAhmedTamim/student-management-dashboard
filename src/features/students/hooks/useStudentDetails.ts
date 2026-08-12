"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as studentsApi from "@/features/students/services/students.api";
import { STUDENT_MESSAGES } from "@/lib/messages";
import type { Student, StudentInput } from "@/features/students/types/student";

export function useStudentDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState<
    Record<string, string>
  >({});
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      const result = await studentsApi.getStudentById(id);
      if (cancelled) return;

      if (result.ok) {
        setStudent(result.data);
      } else {
        setError(result.error.message);
        setStudent(null);
      }

      setLoading(false);
    }

    void loadStudent();

    return () => {
      cancelled = true;
    };
  }, [id, reloadCount]);

  function retryLoad() {
    setLoading(true);
    setError(null);
    setReloadCount((count) => count + 1);
  }

  function toggleEditing() {
    setEditing((prev) => !prev);
    setFormServerErrors({});
  }

  async function updateCurrentStudent(values: StudentInput) {
    setSaving(true);
    setFormServerErrors({});

    const result = await studentsApi.updateStudent(id, values);
    setSaving(false);

    if (!result.ok) {
      if (result.error.details) {
        setFormServerErrors(result.error.details);
      }
      toast.error(result.error.message);
      return false;
    }

    setStudent(result.data);
    setEditing(false);
    toast.success(STUDENT_MESSAGES.updated);
    return true;
  }

  async function deleteCurrentStudent() {
    setSaving(true);

    const result = await studentsApi.deleteStudent(id);
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error.message);
      setConfirmDelete(false);
      return;
    }

    toast.success(STUDENT_MESSAGES.deleted);
    router.push("/");
  }

  return {
    student,
    loading,
    saving,
    error,
    editing,
    confirmDelete,
    formServerErrors,
    retryLoad,
    toggleEditing,
    stopEditing: () => setEditing(false),
    setConfirmDelete,
    updateCurrentStudent,
    deleteCurrentStudent,
  };
}
