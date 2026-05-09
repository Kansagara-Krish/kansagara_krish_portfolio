import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().or(z.date()),
  url: z.string().url().optional().or(z.literal("")),
  credentialId: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ data: certifications });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const dataToValidate = {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    };
    
    const result = certificationSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return NextResponse.json(
        { error: "Validation failed", fields: fieldErrors },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: result.data,
    });

    return NextResponse.json({ data: certification }, { status: 201 });
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 }
    );
  }
}
