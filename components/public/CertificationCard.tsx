"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, X as XIcon, Mail } from "lucide-react";
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
            {/* Floating icon bubbles */}
            <div className="pointer-events-none md:pointer-events-auto bubbles absolute right-4 bottom-4 z-10 hidden md:block">
              <div className="bubble" style={{ animationDelay: "0s" }} title="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.08 1 2.48 1 4.98 2.12 4.98 3.5z" fill="currentColor" transform="translate(3 4)" />
                  <path d="M6 8H0v12h6V8zm7.5 0H7v12h6.5V14c0-2.21 2.5-2.38 2.5 0v6h6.5V13.5C22.5 8.91 18.36 8 16 8c-2.36 0-2.5 1.5-2.5 1.5V8z" fill="currentColor" opacity="0.95" />
                </svg>
                <span className="blast" />
              </div>
              <div className="bubble" style={{ animationDelay: "0.2s" }} title="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.2 9.14 7.64 10.62.56.1.76-.24.76-.53 0-.26-.01-1.12-.02-2.03-3.11.68-3.77-1.5-3.77-1.5-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .72 2.62.51 3.26.39.1-.3.39-.51.71-.63-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.4.11-2.91 0 0 .95-.3 3.11 1.15a10.76 10.76 0 012.83-.38c.96 0 1.93.13 2.83.38 2.16-1.45 3.11-1.15 3.11-1.15.61 1.5.23 2.62.11 2.91.72.78 1.16 1.77 1.16 2.99 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08 0 1.5-.01 2.72-.01 3.09 0 .29.2.64.77.53C20.08 20.89 23.25 16.7 23.25 11.75 23.25 5.48 18.27.5 12 .5z" fill="currentColor"/>
                </svg>
                <span className="blast" />
              </div>
              <div className="bubble" style={{ animationDelay: "0.4s" }} title="Email">
                <Mail size={14} />
                <span className="blast" />
              </div>
              <div className="bubble" style={{ animationDelay: "0.6s" }} title="LeetCode">
                {/* Simple LeetCode SVG icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="0" />
                  <path d="M12.5 3.5c-1.8 0-3.6 1.1-4.5 2.6l-1.9 3.3 2.5 1.4 1.9-3.3c.6-1.1 2-1.8 3.2-1.8v-3.2z" fill="currentColor" />
                </svg>
                <span className="blast" />
              </div>
            </div>
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
      <style jsx>{`
        .bubbles {
          display: flex;
          gap: 8px;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          width: 120px;
          height: 120px;
        }

        .bubble {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(2,6,23,0.6);
          overflow: visible;
          transform: translateY(0);
          transition: transform 180ms ease, opacity 180ms ease;
          animation: float 4s ease-in-out infinite;
        }

        .bubble :global(svg) {
          display: block;
        }

        .bubble:hover {
          transform: scale(1.18);
          z-index: 30;
        }

        .bubble .blast {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 9999px;
          background: radial-gradient(circle at center, rgba(99,102,241,0.18), rgba(99,102,241,0.06));
          pointer-events: none;
          opacity: 0;
        }

        .bubble:hover .blast {
          animation: blast 600ms forwards;
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-6px) translateX(-6px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes blast {
          0% { transform: translate(-50%, -50%) scale(0); opacity: .6; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </Card>
  );
}
