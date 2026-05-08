import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await fetchApi<BlogPostDTO | null>(`/blog/${params.id}`, null);
  if (!post) notFound();
  return <BlogForm post={post} />;
}
