import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { ExperienceDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ExperienceTimeline({ experiences }: { experiences: ExperienceDTO[] }) {
  return (
    <div className="relative space-y-10">
      {experiences.map((item) => (
        <article key={item.id} className="group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:shadow-md sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-bg border border-border">
              {item.logoUrl ? (
                <Image src={item.logoUrl} alt={item.company} fill className="object-cover p-2" sizes="56px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-xl text-primary/50">
                  {item.company.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl tracking-tight">{item.role}</h3>
                    {item.current ? (
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span className="font-medium text-text">{item.company}</span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-muted/70">
                        <MapPin size={13} />
                        {item.location}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar size={13} />
                  {formatDate(item.startDate, "MMM yyyy")} — {item.current ? "Present" : item.endDate ? formatDate(item.endDate, "MMM yyyy") : ""}
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                {item.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                  <Badge key={`${skill}-${index}`} variant="muted" className="text-[10px]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
