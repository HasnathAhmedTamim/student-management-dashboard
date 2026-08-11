import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, toStudentDto } from "@/lib/api";
import {
  formatZodErrors,
  studentInputSchema,
} from "@/lib/validations/student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const className = searchParams.get("class")?.trim() ?? "";

    const where: Prisma.StudentWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "ACTIVE" || status === "INACTIVE") {
      where.status = status;
    }

    if (className) {
      where.class = { equals: className, mode: "insensitive" };
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return jsonOk(students.map(toStudentDto));
  } catch (error) {
    console.error("GET /api/students failed:", error);
    return jsonError("Unable to load students. Please try again.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentInputSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid request.", 400, formatZodErrors(parsed.error));
    }

    const student = await prisma.student.create({
      data: parsed.data,
    });

    return jsonOk(toStudentDto(student), 201);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError("A student with this email already exists.", 400, {
        email: "A student with this email already exists.",
      });
    }

    console.error("POST /api/students failed:", error);
    return jsonError("Unable to create student. Please try again.", 500);
  }
}
