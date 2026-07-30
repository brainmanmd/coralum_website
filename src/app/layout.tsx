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
  title: "Parkinson's Care Between Visits: Telehealth & Symptom Support | Coralum",
  description:
    "Coralum is specialist-designed telehealth for Parkinson's disease — track symptoms, understand day-to-day changes, and get proactive support between neurology visits. Join the waitlist.",
  keywords: [
    "Parkinson's disease care",
    "Parkinson's telehealth",
    "neurology telehealth",
    "symptom tracking",
    "symptom management",
    "motor fluctuations",
    "movement disorder care",
    "neurodegenerative disease support",
    "remote patient monitoring",
    "care between visits",
    "virtual neurology care",
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
    title: "Parkinson's Care Between Visits — Telehealth & Symptom Support | Coralum",
    description:
      "Specialist-designed telehealth for Parkinson's disease. Track symptoms and get proactive support between neurology visits. Join the waitlist.",
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
    title: "Parkinson's Care Between Visits — Telehealth & Symptom Support | Coralum",
    description:
      "Specialist-designed telehealth for Parkinson's disease. Track symptoms and get proactive support between neurology visits.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#16243b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Organization", "MedicalBusiness"],
            name: "Coralum",
            url: "https://coralum.ai",
            logo: "https://coralum.ai/images/coralum-logo.png",
            description:
              "Coralum is specialist-designed telehealth for Parkinson's disease, helping people track symptoms and get proactive support between neurology visits.",
            medicalSpecialty: "Neurologic",
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
