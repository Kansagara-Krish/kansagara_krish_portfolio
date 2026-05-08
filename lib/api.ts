import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

export function dataResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(error: string, status = 500, fields?: Record<string, string[]>) {
  return NextResponse.json(fields ? { error, fields } : { error }, { status });
}

export function validationErrorResponse(error: ZodError) {
  const fields = Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
  );
  return errorResponse("Validation failed", 400, fields);
}

export async function requireAdmin() {
  const session = await auth();
  return session?.user ? session : null;
}

export function normalizeTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
}
