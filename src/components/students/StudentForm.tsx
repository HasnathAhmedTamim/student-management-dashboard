"use client";

import { useEffect, useMemo, useState } from "react";
import type { Student, StudentInput, StudentStatus } from "@/types/student";
import {
  formatZodErrors,
  studentInputSchema,
} from "@/lib/validations/student";

interface StudentFormProps {
  mode: "create" | "edit";
  initialValues?: Student | null;
  submitting?: boolean;
  serverErrors?: Record<string, string>;
  onSubmit: (values: StudentInput) => Promise<boolean> | boolean;
  onCancel: () => void;
}

const emptyValues: StudentInput = {
  name: "",
  email: "",
  phone: "",
  class: "",
  status: "ACTIVE",
};

export function StudentForm({
  mode,
  initialValues,
  submitting = false,
  serverErrors,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const defaults = useMemo<StudentInput>(() => {
    if (!initialValues) return emptyValues;
    return {
      name: initialValues.name,
      email: initialValues.email,
      phone: initialValues.phone,
      class: initialValues.class,
      status: initialValues.status,
    };
  }, [initialValues]);

  const [values, setValues] = useState<StudentInput>(defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(defaults);
    setErrors({});
  }, [defaults]);

  useEffect(() => {
    if (serverErrors) {
      setErrors(serverErrors);
    }
  }, [serverErrors]);

  function updateField<K extends keyof StudentInput>(
    key: K,
    value: StudentInput[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = studentInputSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      return;
    }

    const ok = await onSubmit(parsed.data);
    if (ok && mode === "create") {
      setValues(emptyValues);
      setErrors({});
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          placeholder="Student full name"
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          placeholder="name@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          placeholder="+8801XXXXXXXXX"
        />
        {errors.phone ? (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="class" className="mb-1 block text-sm font-medium text-slate-700">
          Class
        </label>
        <input
          id="class"
          name="class"
          value={values.class}
          onChange={(e) => updateField("class", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          placeholder="Grade 10"
        />
        {errors.class ? (
          <p className="mt-1 text-sm text-red-600">{errors.class}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={(e) =>
            updateField("status", e.target.value as StudentStatus)
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        {errors.status ? (
          <p className="mt-1 text-sm text-red-600">{errors.status}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Add Student"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
