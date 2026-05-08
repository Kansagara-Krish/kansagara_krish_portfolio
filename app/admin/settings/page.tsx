import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings().then(s => s || defaultSettings);
  return <SettingsForm settings={settings} />;
}
