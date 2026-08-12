import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as studentsApi from "@/features/students/services/students.api";
import type { ApiErrorPayload } from "@/features/students/services/students.api";
import { STUDENT_MESSAGES } from "@/lib/messages";
import type {
  PaginationMeta,
  SortOrder,
  Student,
  StudentFilters,
  StudentInput,
  StudentSortBy,
  StudentStatus,
} from "@/features/students/types/student";

export interface StudentsState {
  items: Student[];
  meta: PaginationMeta;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  filters: StudentFilters;
}

const initialState: StudentsState = {
  items: [],
  meta: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
  filters: {
    search: "",
    status: "",
    className: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 5,
  },
};

// Thunks only orchestrate: the HTTP work lives in services/students.api.ts.
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { students: StudentsState };
    const result = await studentsApi.listStudents(state.students.filters);

    if (!result.ok) return rejectWithValue(result.error);

    return result.data;
  },
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (payload: StudentInput, { rejectWithValue }) => {
    const result = await studentsApi.createStudent(payload);

    if (!result.ok) return rejectWithValue(result.error);

    return result.data;
  },
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { id, data }: { id: string; data: StudentInput },
    { rejectWithValue },
  ) => {
    const result = await studentsApi.updateStudent(id, data);

    if (!result.ok) return rejectWithValue(result.error);

    return result.data;
  },
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id: string, { rejectWithValue }) => {
    const result = await studentsApi.deleteStudent(id);

    if (!result.ok) return rejectWithValue(result.error);

    return id;
  },
);

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setStatusFilter(state, action: PayloadAction<"" | StudentStatus>) {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setClassFilter(state, action: PayloadAction<string>) {
      state.filters.className = action.payload;
      state.filters.page = 1;
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: StudentSortBy; sortOrder: SortOrder }>,
    ) {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = Math.max(1, action.payload);
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const readError = (payload: unknown, fallback: string) =>
      (payload as ApiErrorPayload | undefined)?.message || fallback;

    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
        state.filters.page = action.payload.meta.page;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = readError(action.payload, STUDENT_MESSAGES.listFailed);
      })
      .addCase(createStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createStudent.fulfilled, (state) => {
        state.saving = false;
        state.filters.page = 1;
        state.successMessage = STUDENT_MESSAGES.created;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = readError(action.payload, STUDENT_MESSAGES.createFailed);
      })
      .addCase(updateStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((student) =>
          student.id === action.payload.id ? action.payload : student,
        );
        state.successMessage = STUDENT_MESSAGES.updated;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = readError(action.payload, STUDENT_MESSAGES.updateFailed);
      })
      .addCase(deleteStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteStudent.fulfilled, (state) => {
        state.saving = false;
        state.successMessage = STUDENT_MESSAGES.deleted;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = readError(action.payload, STUDENT_MESSAGES.deleteFailed);
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setClassFilter,
  setSort,
  setPage,
  clearMessages,
} = studentsSlice.actions;

export default studentsSlice.reducer;
