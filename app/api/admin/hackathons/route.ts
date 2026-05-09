import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const hackathonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  project: z.string().min(1, "Project is required"),
  role: z.string().optional(),
  date: z.string().or(z.date()),
  location: z.string().optional(),
  result: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  image: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const hackathons = await prisma.hackathon.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ data: hackathons });
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
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
    
    const result = hackathonSchema.safeParse(dataToValidate);

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

    const hackathon = await prisma.hackathon.create({
      data: result.data,
    });

    return NextResponse.json({ data: hackathon }, { status: 201 });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    return NextResponse.json(
      { error: "Failed to create hackathon" },
      { status: 500 }
    );
  }
}
