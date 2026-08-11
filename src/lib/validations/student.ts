import { z } from "zod";

export const studentStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const studentInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .max(30, "Phone must be 30 characters or fewer."),
  class: z
    .string()
    .trim()
    .min(1, "Class is required.")
    .max(50, "Class must be 50 characters or fewer."),
  status: studentStatusSchema,
});

export type StudentInputSchema = z.infer<typeof studentInputSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}
