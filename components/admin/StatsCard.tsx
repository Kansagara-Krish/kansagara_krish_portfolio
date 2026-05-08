import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatsCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
        </div>
        <div className="rounded-[8px] bg-primary/10 p-3 text-primary">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
