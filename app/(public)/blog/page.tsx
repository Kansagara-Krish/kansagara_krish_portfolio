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
    <div className="relative min-h-screen overflow-hidden bg-bg/50">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">My Blog</p>
          <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            My thoughts on <br /><span className="text-gradient">building things.</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted lg:text-xl">
            I write about how I build software and the things I learn along the way.
          </p>
        </div>

        <div className="mt-16">
          <FilterableBlog posts={posts} />
        </div>
      </section>
    </div>
  );
}
