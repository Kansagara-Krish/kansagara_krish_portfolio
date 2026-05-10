import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

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
  description: "I build fast, easy-to-use websites and apps. See my work, blog, and history.",
  metadataBase: new URL(baseUrl),
  keywords: ["Computer Engineer", "Software Developer", "Portfolio", "Full-Stack", "Next.js", "React"],
  authors: [{ name: "Pratham Rajbhar", url: baseUrl }],
  creator: "Pratham Rajbhar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Pratham Rajbhar | Portfolio",
    description: "I build fast, easy-to-use websites and apps.",
    siteName: "Pratham Rajbhar",
    images: [`${baseUrl}/api/og?title=${encodeURIComponent("Pratham Rajbhar")}&subtitle=${encodeURIComponent("Portfolio")}`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Rajbhar | Portfolio",
    description: "I build fast, easy-to-use websites and apps.",
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
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = getBaseUrl();
  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pratham Rajbhar",
    url: baseUrl,
    description: "I build fast, easy-to-use websites and apps."
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
