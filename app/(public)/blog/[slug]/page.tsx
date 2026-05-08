import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopyCodeButtons } from "@/components/public/CopyCodeButtons";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { ViewTracker } from "@/components/public/ViewTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate, sanitizeHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchApi<BlogPostDTO | null>(`/blog/${params.slug}`, null);
  return {
    title: post?.title ?? "Blog post",
    description: post?.excerpt ?? "Blog post",
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(post?.title ?? "Blog post")}&subtitle=Blog`]
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchApi<BlogPostDTO | null>(`/blog/${params.slug}`, null);
  if (!post) notFound();

  return (
    <article>
      <ReadingProgress />
      <CopyCodeButtons />
      <ViewTracker path={`/api/blog/${post.id}`} />
      <div className="relative h-[45vh] min-h-80 bg-muted/10">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Button href="/blog" variant="ghost" icon={<ArrowLeft size={18} />}>Back</Button>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => <Badge key={tag.id} variant="muted">{tag.name}</Badge>)}
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(post.createdAt)}</span>
          <span className="inline-flex items-center gap-2"><Clock size={16} /> {post.readingTime} min read</span>
        </div>
        <div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      </div>
    </article>
  );
}
