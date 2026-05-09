import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { certificationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = certificationSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: validated.data
    });

    return dataResponse(certification);
  } catch (_error) {
    return errorResponse("Unable to update certification");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.certification.delete({
      where: { id }
    });
    return dataResponse({ message: "Certification deleted" });
  } catch (_error) {
    return errorResponse("Unable to delete certification");
  }
}
