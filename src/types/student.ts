export type StudentStatus = "ACTIVE" | "INACTIVE";

export type StudentSortBy = "name" | "class" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  status: StudentStatus;
  createdAt: string;
}

export interface StudentInput {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: StudentStatus;
}

export interface StudentFilters {
  search: string;
  status: "" | StudentStatus;
  className: string;
  sortBy: StudentSortBy;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentsListResponse {
  data: Student[];
  meta: PaginationMeta;
}
