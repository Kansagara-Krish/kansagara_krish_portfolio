import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }]
    });
    return dataResponse(skills);
  } catch {
    return errorResponse("Unable to fetch skills");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = skillSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const skill = await prisma.skill.create({ data: parsed.data });
    return dataResponse(skill, 201);
  } catch {
    return errorResponse("Unable to create skill");
  }
}
