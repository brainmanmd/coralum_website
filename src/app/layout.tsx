import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coralum.ai"),
  title: "Coralum — Better Parkinson's Care Between Visits",
  description:
    "Coralum helps people with Parkinson's stay supported between doctor visits — lightweight tracking, proactive care, and fewer surprises. Join the waitlist.",
  keywords: [
    "Parkinson's care",
    "Parkinson's disease",
    "Parkinson's support",
    "digital health",
    "remote patient monitoring",
    "care between visits",
    "movement disorder",
    "caregiver support",
  ],
  authors: [{ name: "Coralum" }],
  creator: "Coralum",
  publisher: "Coralum",
  alternates: {
    canonical: "/",
  },
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
    url: "https://coralum.ai",
    title: "Coralum — Better Parkinson's Care Between Visits",
    description:
      "Lightweight support between doctor visits, built to help people with Parkinson's live better. Join the waitlist.",
    siteName: "Coralum",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Coralum — Closing the Parkinson's Care Loop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coralum — Better Parkinson's Care Between Visits",
    description:
      "Lightweight support between doctor visits, built to help people with Parkinson's live better.",
    images: ["/og-image.png"],
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Coralum",
            url: "https://coralum.ai",
            logo: "https://coralum.ai/images/coralum-logo.png",
            description:
              "Coralum helps people with Parkinson's stay supported between doctor visits with lightweight tracking and proactive care.",
          })}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${dmSans.variable} ${dmMono.variable} min-h-full antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
