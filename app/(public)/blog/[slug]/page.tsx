import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { BlogPostClient } from "@/components/public/BlogPostClient";
import { MdxContent } from "@/components/public/MdxContent";
import { getBlogPostBySlug } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/structured-data";

export const revalidate = 3600;

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

  const baseUrl = getBaseUrl();
  const blogPostSchema = JSON.stringify(generateBlogPostSchema(post));
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema([
    { name: "Home", item: baseUrl },
    { name: "Blog", item: `${baseUrl}/blog` },
    { name: post.title, item: `${baseUrl}/blog/${slug}` }
  ]));

  return (
    <>
      <Script
        id="structured-data-blog-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: blogPostSchema }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />
      <BlogPostClient post={post}>
        <MdxContent source={post.content} />
      </BlogPostClient>
    </>
  );
}
