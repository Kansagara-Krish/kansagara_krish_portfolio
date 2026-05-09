import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return dataResponse(projects);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch projects");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = projectSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const project = await prisma.project.create({
      data: validated.data
    });

    return dataResponse(project, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to create project");
  }
}
