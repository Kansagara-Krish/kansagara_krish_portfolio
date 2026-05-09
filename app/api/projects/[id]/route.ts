import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    if (!project) return errorResponse("Project not found", 404);
    return dataResponse(project);
  } catch (_error) {
    return errorResponse("Unable to fetch project");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = projectSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const project = await prisma.project.update({
      where: { id },
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

    return dataResponse(project);
  } catch (_error) {
    return errorResponse("Unable to update project");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });
    return dataResponse({ message: "Project deleted" });
  } catch (_error) {
    return errorResponse("Unable to delete project");
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.update({
      where: { id },
      data: { featured: true }
    });
    return dataResponse(project);
  } catch (_error) {
    return errorResponse("Unable to update project");
  }
}
