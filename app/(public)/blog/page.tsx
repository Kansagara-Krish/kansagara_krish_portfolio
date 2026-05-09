import type { Metadata } from "next";
import { FilterableBlog } from "@/components/public/FilterableBlog";
import { getBlogPosts } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, guides, and tips on software engineering, system design, and building products.",
  alternates: {
    canonical: "/blog"
  }
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="relative overflow-hidden">
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Journal</p>
          <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Writing from the <span className="text-gradient">build floor.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            Notes on building systems, how things work, and lessons learned while making digital products.
          </p>
        </div>

        <div className="mt-16">
          <FilterableBlog posts={posts} />
        </div>
      </section>
    </div>
  );
}
