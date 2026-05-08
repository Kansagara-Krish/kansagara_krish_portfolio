import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const components = {
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a {...props} target={props.href?.startsWith("http") ? "_blank" : props.target} rel={props.href?.startsWith("http") ? "noreferrer" : props.rel} />
  ),
  img: ({ alt = "", src, ...props }: ComponentPropsWithoutRef<"img">) => (
    <div className="relative my-10 aspect-video w-full overflow-hidden rounded-[8px] border border-border shadow-lg">
      <Image 
        src={src || ""} 
        alt={alt} 
        fill 
        className="object-cover" 
        sizes="(min-width: 1200px) 800px, 100vw"
      />
    </div>
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto rounded-[8px] border border-border">
      <table {...props} />
    </div>
  ),
  Callout: ({ children }: { children: ReactNode }) => (
    <div className="my-8 rounded-[8px] border border-primary/25 bg-primary/10 p-5 text-base leading-relaxed text-text">
      {children}
    </div>
  )
};

export async function MdxContent({ source }: { source: string }) {
  try {
    const { content } = await compileMDX({
      source,
      components,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm]
        }
      }
    });

    return <>{content}</>;
  } catch (error) {
    return (
      <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-5">
        <p className="font-semibold text-red-500">This MDX could not be rendered.</p>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm text-muted">{error instanceof Error ? error.message : "Unknown MDX error"}</pre>
      </div>
    );
  }
}
