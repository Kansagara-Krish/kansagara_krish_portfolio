import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased selection:bg-primary/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
