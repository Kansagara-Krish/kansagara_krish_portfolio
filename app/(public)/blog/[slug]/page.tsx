import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/public/BlogPostClient";
import { MdxContent } from "@/components/public/MdxContent";
import { getAllBlogPostSlugs, getBlogPostBySlug } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const baseUrl = getBaseUrl();
  return {
    title: post?.title ?? "Blog post",
    description: post?.excerpt ?? "Blog post",
    alternates: {
      canonical: `/blog/${slug}`
    },
    openGraph: {
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(post?.title ?? "Blog post")}&subtitle=${encodeURIComponent("Blog")}`]
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <BlogPostClient post={post}>
      <MdxContent source={post.content} />
    </BlogPostClient>
  );
}
