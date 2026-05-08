import { BlogTable } from "@/components/admin/BlogTable";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await fetchApi<BlogPostDTO[]>("/blog", []);
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted">{posts.length} posts</p>
        <Button href="/admin/blog/new">New Post</Button>
      </div>
      <BlogTable posts={posts} />
    </div>
  );
}
