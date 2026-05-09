import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPostDTO }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/10">
          <Image
            src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="muted">{tag}</Badge>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`} className="mt-4 block font-display text-xl tracking-tight transition-colors hover:text-primary">
          {post.title}
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {formatDate(post.createdAt)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readingTime} min read</span>
        </div>
      </div>
    </Card>
  );
}
