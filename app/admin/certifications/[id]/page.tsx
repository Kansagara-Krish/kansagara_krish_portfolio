import { notFound } from "next/navigation";
import { CertificationForm } from "@/components/admin/CertificationForm";
import { getCertificationById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getCertificationById(id);
  if (!item) notFound();
  return <CertificationForm initialData={item} />;
}