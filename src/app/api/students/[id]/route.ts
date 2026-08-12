import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/apiResponse";
import { STUDENT_MESSAGES } from "@/lib/messages";
import { toStudentDto } from "@/features/students/services/students.mapper";
import {
  formatZodErrors,
  studentInputSchema,
} from "@/features/students/validations/student.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return jsonError(STUDENT_MESSAGES.notFound, 404);
    }

    return jsonOk(toStudentDto(student));
  } catch (error) {
    console.error("GET /api/students/[id] failed:", error);
    return jsonError(STUDENT_MESSAGES.loadFailed, 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const parsed = studentInputSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        STUDENT_MESSAGES.invalidRequest,
        400,
        formatZodErrors(parsed.error),
      );
    }

    const existing = await prisma.student.findUnique({ where: { id } });

    if (!existing) {
      return jsonError(STUDENT_MESSAGES.notFound, 404);
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
      return jsonError(STUDENT_MESSAGES.duplicateEmail, 400, {
        email: STUDENT_MESSAGES.duplicateEmail,
      });
    }

    console.error("PATCH /api/students/[id] failed:", error);
    return jsonError(STUDENT_MESSAGES.updateFailed, 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.student.findUnique({ where: { id } });

    if (!existing) {
      return jsonError(STUDENT_MESSAGES.notFound, 404);
    }

    await prisma.student.delete({ where: { id } });

    return jsonOk({ message: STUDENT_MESSAGES.deleted });
  } catch (error) {
    console.error("DELETE /api/students/[id] failed:", error);
    return jsonError(STUDENT_MESSAGES.deleteFailed, 500);
  }
}
