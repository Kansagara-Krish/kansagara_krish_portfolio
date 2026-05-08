import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/public/BlogPostClient";
import { MdxContent } from "@/components/public/MdxContent";
import { getBlogPostBySlug, getAllBlogPostSlugs } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  return {
    title: post?.title ?? "Blog post",
    description: post?.excerpt ?? "Blog post",
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(post?.title ?? "Blog post")}&subtitle=Blog`]
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <BlogPostClient post={post}>
      <MdxContent source={post.content} />
    </BlogPostClient>
  );
}
