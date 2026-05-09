import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { skillSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    });
    return dataResponse(skills);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch skills");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = skillSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const skill = await prisma.skill.create({
      data: validated.data
    });

    return dataResponse(skill, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to create skill");
  }
}
