import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

import { SmoothScroll } from "@/components/public/SmoothScroll";
import { ScrollProgressBar } from "@/components/ui/ScrollReveal";
import { RobotChatbot } from "@/components/public/RobotChatbot";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().then(s => s || defaultSettings);

  return (
    <SmoothScroll>
      <ScrollProgressBar />
      <div className="min-h-screen bg-bg text-text pt-12">
        <Navbar name={settings.name} openToWork={settings.openToWork} />
        <main>{children}</main>
        <Footer settings={settings} />
        <RobotChatbot />
      </div>
    </SmoothScroll>
  );
}
