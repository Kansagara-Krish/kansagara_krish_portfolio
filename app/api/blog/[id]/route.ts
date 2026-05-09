import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { blogPostSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    if (!post) return errorResponse("Blog post not found", 404);
    return dataResponse(post);
  } catch (_error) {
    return errorResponse("Unable to fetch blog post");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = blogPostSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: validated.data.title,
        slug: validated.data.slug,
        excerpt: validated.data.excerpt,
        content: validated.data.content,
        contentFormat: validated.data.contentFormat,
        coverImage: validated.data.coverImage,
        published: validated.data.published,
        readingTime: validated.data.readingTime,
        tags: validated.data.tags
      }
    });

    return dataResponse(post);
  } catch (_error) {
    return errorResponse("Unable to update blog post");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id }
    });
    return dataResponse({ message: "Blog post deleted" });
  } catch (_error) {
    return errorResponse("Unable to delete blog post");
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.update({
      where: { id },
      data: { published: true }
    });
    return dataResponse(post);
  } catch (_error) {
    return errorResponse("Unable to update post");
  }
}
