import { STUDENT_MESSAGES } from "@/lib/messages";
import type {
  Student,
  StudentFilters,
  StudentInput,
  StudentsListResponse,
} from "@/features/students/types/student";

const STUDENTS_URL = "/api/students";

/** Shape of every failed request, so callers handle errors the same way. */
export interface ApiErrorPayload {
  message: string;
  details?: Record<string, string>;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorPayload };

export function buildStudentsQuery(filters: StudentFilters) {
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

  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  return `?${params.toString()}`;
}

async function readError(
  response: Response,
  fallback: string,
): Promise<ApiErrorPayload> {
  try {
    const body = (await response.json()) as ApiErrorPayload | null;
    return {
      message: body?.message || fallback,
      details: body?.details,
    };
  } catch {
    return { message: fallback };
  }
}

async function request<T>(
  url: string,
  fallbackMessage: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      return { ok: false, error: await readError(response, fallbackMessage) };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, error: { message: fallbackMessage } };
  }
}

function jsonBody(data: StudentInput): RequestInit {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function listStudents(filters: StudentFilters) {
  return request<StudentsListResponse>(
    `${STUDENTS_URL}${buildStudentsQuery(filters)}`,
    STUDENT_MESSAGES.listFailed,
  );
}

export function getStudentById(id: string) {
  return request<Student>(`${STUDENTS_URL}/${id}`, STUDENT_MESSAGES.loadFailed);
}

export function createStudent(data: StudentInput) {
  return request<Student>(STUDENTS_URL, STUDENT_MESSAGES.createFailed, {
    method: "POST",
    ...jsonBody(data),
  });
}

export function updateStudent(id: string, data: StudentInput) {
  return request<Student>(
    `${STUDENTS_URL}/${id}`,
    STUDENT_MESSAGES.updateFailed,
    {
      method: "PATCH",
      ...jsonBody(data),
    },
  );
}

export function deleteStudent(id: string) {
  return request<{ message: string }>(
    `${STUDENTS_URL}/${id}`,
    STUDENT_MESSAGES.deleteFailed,
    { method: "DELETE" },
  );
}
