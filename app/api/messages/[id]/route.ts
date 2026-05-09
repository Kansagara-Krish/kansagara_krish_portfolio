import { dataResponse, errorResponse, requireAdmin } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const message = await prisma.message.update({
      where: { id },
      data: { read: true }
    });
    return dataResponse(message);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to mark message as read");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.message.delete({
      where: { id }
    });
    return dataResponse({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to delete message");
  }
}
