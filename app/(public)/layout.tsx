import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { SiteSettingsDTO } from "@/lib/types";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchApi<SiteSettingsDTO>("/settings", defaultSettings);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar name={settings.name} />
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
