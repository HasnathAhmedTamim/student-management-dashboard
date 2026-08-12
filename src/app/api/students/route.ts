import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/apiResponse";
import { STUDENT_MESSAGES } from "@/lib/messages";
import { toStudentDto } from "@/features/students/services/students.mapper";
import {
  formatZodErrors,
  studentInputSchema,
} from "@/features/students/validations/student.schema";

const SORT_FIELDS = ["name", "class", "createdAt"] as const;
type SortField = (typeof SORT_FIELDS)[number];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const className = searchParams.get("class")?.trim() ?? "";
    const sortByParam = searchParams.get("sortBy")?.trim() ?? "createdAt";
    const sortOrderParam = searchParams.get("sortOrder")?.trim() ?? "desc";

    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? "5") || 5),
    );

    const sortBy: SortField = SORT_FIELDS.includes(sortByParam as SortField)
      ? (sortByParam as SortField)
      : "createdAt";
    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc";

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

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return jsonOk({
      data: students.map(toStudentDto),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/students failed:", error);
    return jsonError(STUDENT_MESSAGES.listFailed, 500);
  }
}

export async function POST(request: Request) {
  try {
    // A malformed body must fail validation (400), not crash the handler (500).
    const body = await request.json().catch(() => null);
    const parsed = studentInputSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        STUDENT_MESSAGES.invalidRequest,
        400,
        formatZodErrors(parsed.error),
      );
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
      return jsonError(STUDENT_MESSAGES.duplicateEmail, 400, {
        email: STUDENT_MESSAGES.duplicateEmail,
      });
    }

    console.error("POST /api/students failed:", error);
    return jsonError(STUDENT_MESSAGES.createFailed, 500);
  }
}
