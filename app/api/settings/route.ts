import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { settingsSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          name: "Your Name",
          title: "Your Title",
          bio: "Your bio goes here",
          email: "your.email@example.com"
        }
      });
    }
    return dataResponse(settings);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch settings");
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = settingsSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const existingSettings = await prisma.settings.findFirst();
    let settings;
    
    if (existingSettings) {
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: validated.data
      });
    } else {
      settings = await prisma.settings.create({
        data: validated.data
      });
    }

    return dataResponse(settings);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to update settings");
  }
}

export async function PATCH() {
  try {
    return dataResponse({ message: "Resume download tracked" });
  } catch (error) {
    console.error("Failed to track resume download:", error);
    return errorResponse("Unable to track resume download", 500);
  }
}
