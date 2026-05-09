import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { blogPostSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return dataResponse(posts);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch blog posts");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const validated = blogPostSchema.safeParse(body);
    
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const post = await prisma.blogPost.create({
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

    return dataResponse(post, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to create blog post");
  }
}
