import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { certificationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { date: 'desc' }
    });
    return dataResponse(certifications);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch certifications");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = certificationSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const certification = await prisma.certification.create({
      data: validated.data
    });

    return dataResponse(certification, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to create certification");
  }
}
