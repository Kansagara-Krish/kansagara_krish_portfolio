import { z } from "zod";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { experienceSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

const reorderSchema = z.object({ order: z.coerce.number().int() });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = experienceSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...validated.data,
        skills: validated.data.skills
      }
    });

    return dataResponse(experience);
  } catch (_error) {
    return errorResponse("Unable to update experience");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = reorderSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: { order: validated.data.order }
    });

    return dataResponse(experience);
  } catch (_error) {
    return errorResponse("Unable to reorder experience");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id }
    });
    return dataResponse({ message: "Experience deleted" });
  } catch (_error) {
    return errorResponse("Unable to delete experience");
  }
}
