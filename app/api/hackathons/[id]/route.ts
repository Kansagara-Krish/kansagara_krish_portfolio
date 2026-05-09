import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { hackathonSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = hackathonSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const hackathon = await prisma.hackathon.update({
      where: { id },
      data: validated.data
    });

    return dataResponse(hackathon);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to update hackathon");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.hackathon.delete({
      where: { id }
    });
    return dataResponse({ message: "Hackathon deleted" });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to delete hackathon");
  }
}
