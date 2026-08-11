"use client";

import { useEffect, useState } from "react";
import {
  setClassFilter,
  setSearch,
  setStatusFilter,
} from "@/store/studentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { StudentStatus } from "@/types/student";

interface StudentFiltersProps {
  onFilterChange: () => void;
}

export function StudentFiltersBar({ onFilterChange }: StudentFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.students.filters);
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearch(localSearch));
        onFilterChange();
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch, onFilterChange]);

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <div className="md:col-span-1">
        <label htmlFor="search" className="mb-1 block text-sm font-medium text-slate-700">
          Search
        </label>
        <input
          id="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div>
        <label htmlFor="statusFilter" className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="statusFilter"
          value={filters.status}
          onChange={(e) => {
            dispatch(setStatusFilter(e.target.value as "" | StudentStatus));
            onFilterChange();
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div>
        <label htmlFor="classFilter" className="mb-1 block text-sm font-medium text-slate-700">
          Class
        </label>
        <input
          id="classFilter"
          value={filters.className}
          onChange={(e) => {
            dispatch(setClassFilter(e.target.value));
            onFilterChange();
          }}
          placeholder="e.g. Grade 10"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>
    </div>
  );
}
