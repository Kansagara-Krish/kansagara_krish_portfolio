import { BlogTable } from "@/components/admin/BlogTable";
import { Button } from "@/components/ui/Button";
import { getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
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
