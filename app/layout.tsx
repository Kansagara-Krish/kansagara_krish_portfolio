import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { getSiteSettings } from "@/lib/data";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl();

  // No fallbacks - if settings is missing, these will be undefined or empty
  const name = settings?.name ?? "";
  const title = settings?.seoTitle ?? name;
  const description = settings?.seoDescription ?? settings?.heroBio ?? "";
  const keywords = settings?.seoKeywords
    ? settings.seoKeywords.split(",").map((k) => k.trim())
    : [];
  const ogImage = settings?.ogImage ?? `${baseUrl}/api/og?title=${encodeURIComponent(name)}`;

  return {
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    keywords,
    authors: [{ name, url: baseUrl }],
    creator: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title,
      description,
      siteName: name,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = getBaseUrl();
  const settings = await getSiteSettings();
  
  const name = settings?.name ?? "";
  const description = settings?.seoDescription ?? settings?.heroBio ?? "";

  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: baseUrl,
    description,
  });

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme="dark" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
