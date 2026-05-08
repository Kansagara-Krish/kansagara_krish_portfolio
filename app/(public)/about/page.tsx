import type { Metadata } from "next";
import Image from "next/image";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { SiteSettingsDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "About the engineer behind the portfolio."
};

export default async function AboutPage() {
  const [settings, skills] = await Promise.all([
    fetchApi<SiteSettingsDTO>("/settings", defaultSettings),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-[8px] border border-border bg-surface">
          <Image
            src={settings.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop"}
            alt={settings.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 35vw, 100vw"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">About</p>
        <h1 className="mt-3 font-display text-4xl font-bold">{settings.name}</h1>
        <p className="mt-2 text-xl text-muted">{settings.title}</p>
        <p className="mt-6 text-lg leading-8 text-muted">{settings.bio}</p>
        <div className="mt-10">
          <SkillsCloud skills={skills} />
        </div>
      </div>
    </section>
  );
}
