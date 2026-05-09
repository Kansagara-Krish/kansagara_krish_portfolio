import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return dataResponse(projects);
  } catch (_error) {
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
      data: {
        ...validated.data,
        features: validated.data.features,
        outcomes: validated.data.outcomes,
        techStack: validated.data.techStack,
        galleryImages: validated.data.galleryImages,
        projectLinks: validated.data.projectLinks,
        tags: validated.data.tags
      }
    });

    return dataResponse(project, 201);
  } catch (_error) {
    return errorResponse("Unable to create project");
  }
}
