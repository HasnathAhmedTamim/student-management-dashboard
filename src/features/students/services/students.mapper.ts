import type { Student as StudentRecord } from "@prisma/client";
import type { Student } from "@/features/students/types/student";

/** Converts a database row into the JSON shape the client expects. */
export function toStudentDto(student: StudentRecord): Student {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    class: student.class,
    status: student.status,
    createdAt: student.createdAt.toISOString(),
  };
}
