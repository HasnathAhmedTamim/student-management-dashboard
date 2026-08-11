import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Student,
  StudentFilters,
  StudentInput,
  StudentStatus,
} from "@/types/student";

interface StudentsState {
  items: Student[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  filters: StudentFilters;
}

const initialState: StudentsState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
  filters: {
    search: "",
    status: "",
    className: "",
  },
};

function buildQuery(filters: StudentFilters) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.className.trim()) {
    params.set("class", filters.className.trim());
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { students: StudentsState };
    const response = await fetch(`/api/students${buildQuery(state.students.filters)}`);

    if (!response.ok) {
      return rejectWithValue(
        await readErrorMessage(
          response,
          "Unable to load students. Please try again.",
        ),
      );
    }

    return (await response.json()) as Student[];
  },
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (payload: StudentInput, { rejectWithValue }) => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return rejectWithValue(
        data ?? { message: "Unable to create student. Please try again." },
      );
    }

    return (await response.json()) as Student;
  },
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { id, data }: { id: string; data: StudentInput },
    { rejectWithValue },
  ) => {
    const response = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return rejectWithValue(
        errorBody ?? { message: "Unable to update student. Please try again." },
      );
    }

    return (await response.json()) as Student;
  },
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id: string, { rejectWithValue }) => {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return rejectWithValue(
        await readErrorMessage(
          response,
          "Unable to delete student. Please try again.",
        ),
      );
    }

    return id;
  },
);

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<"" | StudentStatus>) {
      state.filters.status = action.payload;
    },
    setClassFilter(state, action: PayloadAction<string>) {
      state.filters.className = action.payload;
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Unable to load students. Please try again.";
      })
      .addCase(createStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.saving = false;
        state.items = [action.payload, ...state.items];
        state.successMessage = "Student created successfully.";
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.saving = false;
        const payload = action.payload as { message?: string } | undefined;
        state.error = payload?.message || "Unable to create student.";
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
        state.successMessage = "Student updated successfully.";
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.saving = false;
        const payload = action.payload as { message?: string } | undefined;
        state.error = payload?.message || "Unable to update student.";
      })
      .addCase(deleteStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter(
          (student) => student.id !== action.payload,
        );
        state.successMessage = "Student deleted successfully.";
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.saving = false;
        state.error =
          (action.payload as string) || "Unable to delete student.";
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setClassFilter,
  clearMessages,
} = studentsSlice.actions;

export default studentsSlice.reducer;
