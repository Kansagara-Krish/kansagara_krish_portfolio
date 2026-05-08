import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" }
    });
    return dataResponse(settings);
  } catch {
    return errorResponse("Unable to fetch settings");
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...parsed.data },
      update: parsed.data
    });
    return dataResponse(settings);
  } catch {
    return errorResponse("Unable to update settings");
  }
}

export async function PATCH() {
  try {
    const settings = await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: { resumeDownloads: { increment: 1 } }
    });
    return dataResponse(settings);
  } catch {
    return errorResponse("Unable to track resume download");
  }
}
