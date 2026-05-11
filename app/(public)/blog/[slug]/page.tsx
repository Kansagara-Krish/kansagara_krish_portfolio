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

  const title = post?.seoTitle ?? post?.title ?? "Blog Post";
  const description = post?.seoDescription ?? post?.excerpt ?? "Blog post";
  const keywords = post?.seoKeywords
    ? post.seoKeywords.split(",").map((k) => k.trim())
    : post?.tags ?? [];
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(post?.title ?? "Blog Post")}&subtitle=${encodeURIComponent("Blog")}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${slug}`,
      images: [ogImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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
