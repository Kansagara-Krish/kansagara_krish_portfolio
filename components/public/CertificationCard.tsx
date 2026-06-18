"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, X as XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { CertificationDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function CertificationCard({ cert }: { cert: CertificationDTO }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const prev = typeof document !== "undefined" ? document.body.style.overflow : undefined;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = prev || "";
    };
  }, [open]);

  const portalHost = typeof document !== "undefined" ? document.body ?? document.createElement("div") : null;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-surface/30 transition-all duration-500 hover:border-primary/30 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
      {cert.image ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative aspect-[16/10] overflow-hidden block w-full"
            aria-label={`Open ${cert.name} image`}
          >
            <Image
              src={cert.image}
              alt={cert.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>

          {open && portalHost
            ? createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-90 p-6">
                  <div className="relative max-w-[95%] max-h-[95%]">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 z-[100000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-2xl ring-1 ring-black/10"
                      aria-label="Close image"
                    >
                      <XIcon size={20} />
                    </button>

                    <img src={cert.image} alt={cert.name} className="max-w-full max-h-[85vh] object-contain rounded" />
                  </div>
                </div>,
                portalHost
              )
            : null}
        </>
      ) : null}

      <div className="flex flex-1 flex-col p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" className="bg-primary/5 border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary/80">
            {cert.issuer}
          </Badge>
        </div>

        <Link href={`/certifications/${cert.slug}`} className="block">
          <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
            {cert.name}
          </h3>
        </Link>

        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted/80">
          View the certificate detail page for the full image, issuer information, and verification link.
        </p>

        <div className="mt-auto pt-8 flex items-center justify-start border-t border-border/50">
          <span className="flex items-center gap-2 text-[11px] font-medium text-muted/60 uppercase tracking-widest">
            <Calendar size={14} className="text-primary/40" />
            {formatDate(cert.date, "MMM yyyy")}
          </span>
        </div>
      </div>
    </Card>
  );
}
