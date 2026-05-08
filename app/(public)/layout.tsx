import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().then(s => s || defaultSettings);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar name={settings.name} />
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
