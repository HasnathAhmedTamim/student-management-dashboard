import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, toStudentDto } from "@/lib/api";
import {
  formatZodErrors,
  studentInputSchema,
} from "@/lib/validations/student";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return jsonError("Student not found.", 404);
    }

    return jsonOk(toStudentDto(student));
  } catch (error) {
    console.error("GET /api/students/[id] failed:", error);
    return jsonError("Unable to load student. Please try again.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = studentInputSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid request.", 400, formatZodErrors(parsed.error));
    }

    const existing = await prisma.student.findUnique({ where: { id } });

    if (!existing) {
      return jsonError("Student not found.", 404);
    }

    const student = await prisma.student.update({
      where: { id },
      data: parsed.data,
    });

    return jsonOk(toStudentDto(student));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError("A student with this email already exists.", 400, {
        email: "A student with this email already exists.",
      });
    }

    console.error("PATCH /api/students/[id] failed:", error);
    return jsonError("Unable to update student. Please try again.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.student.findUnique({ where: { id } });

    if (!existing) {
      return jsonError("Student not found.", 404);
    }

    await prisma.student.delete({ where: { id } });

    return jsonOk({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/students/[id] failed:", error);
    return jsonError("Unable to delete student. Please try again.", 500);
  }
}
