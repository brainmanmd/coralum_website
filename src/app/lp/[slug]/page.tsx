import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/marketing/nav';
import Footer from '@/components/marketing/footer';
import AdHero from '@/components/marketing/ad-hero';
import AdHowItWorks from '@/components/marketing/ad-how-it-works';
import ForCaregivers from '@/components/marketing/for-caregivers';
import TrustBar from '@/components/marketing/trust-bar';
import MobileStickyCta from '@/components/marketing/mobile-sticky-cta';
import { adLandingPages, getAdLandingPage } from '@/lib/landing/ads';

// Ad landing pages are only ever linked directly from ad creative — new
// slugs 404 instead of rendering, same as the SEO landing pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return adLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getAdLandingPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      url: `https://coralum.ai/lp/${page.slug}`,
      title: page.title,
      description: page.description,
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
      title: page.title,
      description: page.description,
      images: ['/og-image.png'],
    },
  };
}

export default async function AdLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAdLandingPage(slug);

  if (!page) {
    notFound();
  }

  const source = `/lp/${page.slug}`;

  return (
    <>
      <Nav minimal />
      <main>
        <AdHero
          headingPlain={page.headingPlain}
          headingHighlight={page.headingHighlight}
          subhead={page.subhead}
          source={source}
        />
        <AdHowItWorks
          heroImage={page.heroImage}
          heroImageAlt={page.heroImageAlt}
          steps={page.steps}
        />
        <ForCaregivers showMedicareBadge source={source} />
        <TrustBar showVentureBacker={false} />
      </main>
      <Footer />
      <div className="h-20 sm:hidden" aria-hidden="true" />
      <MobileStickyCta source={source} />
    </>
  );
}
