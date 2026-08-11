import { NextResponse } from "next/server";
import type { Student } from "@/types/student";

export function toStudentDto(student: {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
}): Student {
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

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      message,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}
