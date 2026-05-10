import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCertificationBySlug } from "@/lib/data";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) return { title: "Not Found" };
  return {
    title: cert.name,
    description: `${cert.name} certified by ${cert.issuer}`,
  };
}

export default async function CertificationDetailPage({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Button href="/experience" variant="ghost" className="group -ml-3 mb-8" icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}>
        Back to Experience
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="default">Certification</Badge>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={14} />
              {new Date(cert.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {cert.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-primary">
            {cert.issuer}
          </p>

          {cert.credentialId && (
            <p className="mt-4 text-sm text-muted">
              Credential ID: <span className="font-mono text-text">{cert.credentialId}</span>
            </p>
          )}

          {cert.url && (
            <div className="mt-8">
              <Button href={cert.url} target="_blank" icon={<ExternalLink size={16} />}>
                Verify Certificate
              </Button>
            </div>
          )}
        </div>

        {cert.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface lg:aspect-auto lg:h-72">
            <Image
              src={cert.image}
              alt={cert.name}
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
