import { SettingsForm } from "@/components/admin/SettingsForm";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { SiteSettingsDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await fetchApi<SiteSettingsDTO>("/settings", defaultSettings);
  return <SettingsForm settings={settings} />;
}
