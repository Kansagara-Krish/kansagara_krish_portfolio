import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { experienceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }]
    });
    return dataResponse(experiences);
  } catch {
    return errorResponse("Unable to fetch experience");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const experience = await prisma.experience.create({ data: parsed.data });
    return dataResponse(experience, 201);
  } catch {
    return errorResponse("Unable to create experience");
  }
}
