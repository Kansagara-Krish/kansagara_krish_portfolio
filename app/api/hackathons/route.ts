import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { hackathonSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hackathons = await prisma.hackathon.findMany({
      orderBy: { date: 'desc' }
    });
    return dataResponse(hackathons);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch hackathons");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = hackathonSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const hackathon = await prisma.hackathon.create({
      data: validated.data
    });

    return dataResponse(hackathon, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to create hackathon");
  }
}
