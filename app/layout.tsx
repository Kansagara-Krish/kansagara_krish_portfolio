import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: {
    default: "Pratham Rajbhar | Portfolio",
    template: "%s | Pratham Rajbhar"
  },
  description: "Full-stack engineer building scalable, user-centric digital solutions. Explore projects, writing, and professional experience.",
  metadataBase: new URL(baseUrl),
  keywords: ["Computer Engineer", "Software Developer", "Portfolio", "Full-Stack", "Next.js", "React"],
  authors: [{ name: "Pratham Rajbhar", url: baseUrl }],
  creator: "Pratham Rajbhar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Pratham Rajbhar | Portfolio",
    description: "Full-stack engineer building scalable, user-centric digital solutions.",
    siteName: "Pratham Rajbhar",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent("Pratham Rajbhar")}&subtitle=${encodeURIComponent("Portfolio")}`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Rajbhar | Portfolio",
    description: "Full-stack engineer building scalable, user-centric digital solutions.",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent("Pratham Rajbhar")}&subtitle=${encodeURIComponent("Portfolio")}`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: baseUrl,
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSerif.variable}`} data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased selection:bg-primary/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
