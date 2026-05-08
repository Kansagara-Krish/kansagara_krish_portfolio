import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, normalizeTags, requireAdmin, validationErrorResponse } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { tags: true },
      orderBy: { createdAt: "desc" }
    });
    return dataResponse(projects);
  } catch {
    return errorResponse("Unable to fetch projects");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const body = await request.json();
    const parsed = projectSchema.safeParse({ ...body, slug: body.slug || slugify(String(body.title ?? "")) });
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const tags = normalizeTags(parsed.data.tags);
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: { tags: true }
    });
    return dataResponse(project, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("A project with this slug already exists.", 400);
    }
    return errorResponse("Unable to create project");
  }
}
