"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { ExperienceDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ExperienceList({ experiences }: { experiences: ExperienceDTO[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<ExperienceDTO | null>(null);

  async function reorder(item: ExperienceDTO, direction: -1 | 1) {
    await fetch(`/api/experience/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: item.order + direction })
    });
    router.refresh();
  }

  async function remove() {
    if (!target) return;
    await fetch(`/api/experience/${target.id}`, { method: "DELETE" });
    setTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="grid gap-4">
        {experiences.map((item) => (
          <Card key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <GripVertical className="text-muted" size={18} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold">{item.role}</h2>
                {item.current ? <Badge variant="success">Current</Badge> : null}
              </div>
              <p className="mt-1 text-muted">{item.company} · {formatDate(item.startDate, "MMM yyyy")} - {item.current ? "Present" : item.endDate ? formatDate(item.endDate, "MMM yyyy") : ""}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => void reorder(item, -1)}>Up</Button>
              <Button size="sm" variant="secondary" onClick={() => void reorder(item, 1)}>Down</Button>
              <Button href={`/admin/experience/${item.id}/edit`} size="icon" variant="ghost" aria-label="Edit experience"><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => setTarget(item)} aria-label="Delete experience"><Trash2 size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={Boolean(target)} title="Delete experience" onClose={() => setTarget(null)}>
        <p className="text-sm text-muted">This permanently deletes {target?.role} at {target?.company}.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
