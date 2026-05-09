import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { skillSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = skillSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: validated.data
    });

    return dataResponse(skill);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to update skill");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id }
    });
    return dataResponse({ message: "Skill deleted" });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to delete skill");
  }
}
