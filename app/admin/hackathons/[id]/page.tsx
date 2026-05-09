import { notFound } from "next/navigation";
import { HackathonForm } from "@/components/admin/HackathonForm";
import { getHackathonById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditHackathonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getHackathonById(id);
  if (!item) notFound();
  return <HackathonForm initialData={item} />;
}