"use client";

import { useEffect, useState } from "react";
import {
  setClassFilter,
  setSearch,
  setSort,
  setStatusFilter,
} from "@/features/students/store/studentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { StudentSortBy, StudentStatus } from "@/features/students/types/student";

interface StudentFiltersProps {
  onFilterChange: () => void;
}

export function StudentFilters({ onFilterChange }: StudentFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.students.filters);
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearch(localSearch));
        onFilterChange();
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch, onFilterChange]);

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="search" className="mb-1 block text-sm font-medium text-slate-700">
          Search
        </label>
        <input
          id="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label htmlFor="sortBy" className="mb-1 block text-sm font-medium text-slate-700">
          Sort by
        </label>
        <select
          id="sortBy"
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":") as [
              StudentSortBy,
              "asc" | "desc",
            ];
            dispatch(setSort({ sortBy, sortOrder }));
            onFilterChange();
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name (A–Z)</option>
          <option value="name:desc">Name (Z–A)</option>
          <option value="class:asc">Class (A–Z)</option>
          <option value="class:desc">Class (Z–A)</option>
        </select>
      </div>
    </div>
  );
}
