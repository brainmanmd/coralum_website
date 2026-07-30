import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/waitlist/waitlist-form';
import { ChevronLeftIcon } from '@/components/marketing/icons';

export const metadata = {
  title: "Join the Waitlist: Telehealth for Parkinson's Care | Coralum",
  description:
    "Be among the first to experience Coralum — specialist-designed telehealth for Parkinson's disease, with symptom tracking and proactive support between neurology visits.",
  alternates: {
    canonical: '/waitlist',
  },
  openGraph: {
    type: 'website',
    url: 'https://coralum.ai/waitlist',
    title: "Join the Waitlist: Telehealth for Parkinson's Care | Coralum",
    description:
      "Be among the first to experience specialist-designed telehealth for Parkinson's disease. Join the Coralum waitlist.",
    siteName: 'Coralum',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Coralum — Closing the Parkinson's Care Loop",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Waitlist | Coralum',
    description:
      "Be among the first to experience AI-enabled care for Parkinson's Disease.",
    images: ['/og-image.png'],
  },
};

export default function WaitlistPage() {
  return (
    <main className="flex min-h-screen flex-col bg-coralum-cream">
      <header className="border-b border-coralum-navy/10 bg-white/80">
        <div className="mx-auto flex h-16 w-full max-w-[768px] items-center justify-between px-6">
          <Link href="/" aria-label="Coralum home">
            <Image
              src="/images/coralum-logo.png"
              alt="Coralum"
              width={120}
              height={36}
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body text-sm font-medium text-coralum-slate transition hover:text-coralum-navy"
          >
            <ChevronLeftIcon className="size-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <WaitlistForm />
      </div>

      <div className="h-1 w-full bg-coralum-navy/10">
        <div className="h-1 w-full bg-coralum-blue" />
      </div>
    </main>
  );
}
