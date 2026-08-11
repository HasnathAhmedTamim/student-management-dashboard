export type StudentStatus = "ACTIVE" | "INACTIVE";

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
}
