import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { experienceSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }]
    });
    return dataResponse(experiences);
  } catch (_error) {
    return errorResponse("Unable to fetch experience");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = experienceSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const experience = await prisma.experience.create({
      data: {
        ...validated.data,
        skills: validated.data.skills
      }
    });

    return dataResponse(experience, 201);
  } catch (_error) {
    return errorResponse("Unable to create experience");
  }
}
