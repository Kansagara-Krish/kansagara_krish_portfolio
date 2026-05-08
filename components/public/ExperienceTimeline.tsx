import { BriefcaseBusiness, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { ExperienceDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ExperienceTimeline({ experiences }: { experiences: ExperienceDTO[] }) {
  return (
    <div className="relative grid gap-6 border-l border-border pl-6">
      {experiences.map((item) => (
        <article key={item.id} className="relative">
          <span className="absolute -left-[31px] top-1 flex h-3 w-3 rounded-full bg-primary ring-4 ring-bg" />
          <div className="flex flex-col gap-4 rounded-[8px] border border-border bg-surface p-5 sm:flex-row">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-bg">
              {item.logoUrl ? (
                <Image src={item.logoUrl} alt={item.company} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-primary">
                  {item.company.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-semibold">{item.role}</h3>
                {item.current ? <Badge variant="success">Current</Badge> : null}
                <Badge variant="muted">{item.type}</Badge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                <BriefcaseBusiness size={15} /> {item.company}
                {item.location ? (
                  <>
                    <MapPin size={15} /> {item.location}
                  </>
                ) : null}
              </p>
              <p className="mt-2 text-sm text-muted">
                {formatDate(item.startDate, "MMM yyyy")} - {item.current ? "Present" : item.endDate ? formatDate(item.endDate, "MMM yyyy") : ""}
              </p>
              <p className="mt-3 leading-7 text-muted">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <Badge key={skill} variant="muted">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
