import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getCertificationBySlug, getAllCertificationSlugs } from "@/lib/data";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCertificationSlugs();
  if (slugs.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return slugs.map((slug) => ({ slug }));
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
    <div className="relative min-h-screen bg-bg/50 overflow-hidden py-16">
      {/* Ambient background glow */}
      <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <ScrollReveal animation="fade-up">
          <Button href="/blog" variant="ghost" className="group -ml-3 mb-8 text-muted hover:text-text" icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}>
            Back to Certificates
          </Button>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_340px] items-start">
          <ScrollReveal animation="fade-right" delay={0.05}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default" className="bg-primary/10 border-primary/20 text-primary font-bold text-xs">
                Verified Certification
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar size={14} className="text-primary/60" />
                {new Date(cert.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl leading-tight">
              {cert.name}
            </h1>
            <p className="mt-4 text-xl font-semibold text-primary">
              {cert.issuer}
            </p>

            {cert.credentialId && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface/50 px-4 py-2 text-sm text-muted backdrop-blur-sm">
                <span className="text-xs uppercase tracking-wider font-bold">Credential ID:</span>
                <span className="font-mono text-text font-bold">{cert.credentialId}</span>
              </div>
            )}

            {cert.url && (
              <div className="mt-8">
                <Button href={cert.url} target="_blank" size="lg" icon={<ExternalLink size={16} />} className="shadow-lg shadow-primary/15">
                  Verify Certificate Online
                </Button>
              </div>
            )}
          </ScrollReveal>

          {cert.image && (
            <ScrollReveal animation="zoom-in" delay={0.15}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/80 bg-surface/50 p-2 shadow-2xl backdrop-blur-md">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(min-width: 1024px) 340px, 100vw"
                  />
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
