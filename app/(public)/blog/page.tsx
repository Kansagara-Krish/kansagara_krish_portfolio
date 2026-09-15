import type { Metadata } from "next";
import { CertificationCard } from "@/components/public/CertificationCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getCertifications, getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Certificates",
  description: "Verified certificates, professional licenses, and achievements.",
  alternates: {
    canonical: "/blog"
  }
};

export default async function BlogPage() {
  const [certifications, settings] = await Promise.all([
    getCertifications(),
    getSiteSettings().then(s => s || defaultSettings),
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg/50">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <ScrollReveal animation="fade-up" className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{settings.blogSubtitle || "Certificates & Credentials"}</p>
          <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            {settings.blogTitle?.split(" ").slice(0, -2).join(" ")} <br /><span className="text-gradient">{settings.blogTitle?.split(" ").slice(-2).join(" ")}</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted lg:text-xl">
            {settings.blogIntro || "Explore verified credentials, licenses, and achievements earned across machine learning, software engineering, and cloud platforms."}
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <ScrollReveal
              key={cert.id}
              animation="fade-up"
              delay={(index % 3) * 0.08}
              duration={0.55}
              viewportOnce={false}
              className="h-full"
            >
              <CertificationCard cert={cert} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
