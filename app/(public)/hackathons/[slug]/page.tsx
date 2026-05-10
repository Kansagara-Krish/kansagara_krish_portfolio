import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getHackathonBySlug } from "@/lib/data";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);
  if (!hackathon) return { title: "Not Found" };
  return {
    title: hackathon.title,
    description: hackathon.description,
  };
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);
  if (!hackathon) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Button href="/experience" variant="ghost" className="group -ml-3 mb-8" icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}>
        Back to Experience
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {hackathon.result && (
              <Badge variant="success">{hackathon.result}</Badge>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={14} />
              {new Date(hackathon.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            {hackathon.location && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin size={14} />
                {hackathon.location}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {hackathon.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-primary">
            {hackathon.project}
          </p>
          {hackathon.role && (
            <p className="mt-2 text-sm text-muted">Role: {hackathon.role}</p>
          )}

          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted">
            <p>{hackathon.description}</p>
          </div>

          {hackathon.link && (
            <div className="mt-8">
              <Button href={hackathon.link} target="_blank" icon={<ExternalLink size={16} />}>
                View Project
              </Button>
            </div>
          )}
        </div>

        {hackathon.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface lg:aspect-auto lg:h-72">
            <Image
              src={hackathon.image}
              alt={hackathon.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 300px, 100vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
