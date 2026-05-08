import type { Metadata } from "next";
import { FilterableBlog } from "@/components/public/FilterableBlog";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering writing, implementation notes, and product lessons."
};

export default async function BlogPage() {
  const posts = await fetchApi<BlogPostDTO[]>("/blog", []);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Blog</p>
      <h1 className="mt-3 font-display text-4xl font-bold">Writing from the build floor</h1>
      <p className="mt-4 max-w-2xl leading-8 text-muted">Notes on engineering systems, dashboards, admin workflows, and the small details that make software feel finished.</p>
      <div className="mt-10">
        <FilterableBlog posts={posts} />
      </div>
    </section>
  );
}
