import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Pratham Rajbhar | Portfolio",
    template: "%s | Pratham Rajbhar"
  },
  description: "A production-grade portfolio with projects, writing, experience, and an admin panel.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  keywords: ["Computer Engineer", "Software Developer", "Portfolio", "Full-Stack"],
  authors: [{ name: "Pratham Rajbhar" }],
  creator: "Pratham Rajbhar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prathamrajbhar.me",
    title: "Pratham Rajbhar | Portfolio",
    description: "Explore my projects, writing, and professional experience.",
    siteName: "Pratham Rajbhar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Rajbhar | Portfolio",
    description: "Explore my projects, writing, and professional experience.",
  },
  icons: {
    icon: "/favicon.ico",
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
