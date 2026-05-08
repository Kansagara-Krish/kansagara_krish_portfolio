import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);
  if (!post) notFound();
  return <BlogForm post={post} />;
}
