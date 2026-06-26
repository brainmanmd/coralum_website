import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coralum Care - Digital Health Platform",
  description:
    "Connect your wearable devices to Coralum Care for personalized health insights. Track sleep, recovery, and wellness metrics from Oura, Whoop, Fitbit, Apple Health, Google Health, and Samsung Health.",
  keywords: [
    "health app",
    "wearable integration",
    "digital health",
    "wellness tracking",
    "fitness data",
    "oura",
    "whoop",
    "fitbit",
  ],
  authors: [{ name: "Coralum Care" }],
  creator: "Coralum Care",
  publisher: "Coralum Care",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coralum.care",
    title: "Coralum Care - Digital Health Platform",
    description: "Connect your wearable devices for personalized health insights.",
    siteName: "Coralum Care",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coralum Care",
    description: "Connect your wearable devices for personalized health insights.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://coralum.care" />
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Coralum Care",
            description: "Digital health platform for wearable device integration",
            applicationCategory: "HealthAndFitnessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
