import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPostDTO }) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-surface/30 transition-all duration-500 hover:border-primary/30 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.slice(0, 2).map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`} 
              variant="default" 
              className="bg-primary/5 border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary/80"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted/80">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-8 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-4 text-[11px] font-medium text-muted/60 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <CalendarDays size={14} className="text-primary/40" /> 
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-primary/40" /> 
              {post.readingTime} min
            </span>
          </div>
          <div className="rounded-full bg-primary/5 p-2 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
             <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Card>
  );
}
