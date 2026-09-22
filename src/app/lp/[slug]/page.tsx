import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
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
  };
}

// Ad landing pages are paused for the waitlist redesign: send anyone who
// still has one of these links to the homepage instead of a dead end. The
// page content and lib/landing/ads.ts entries are left in place to bring
// back later rather than rebuild from scratch.
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

  redirect('/');
}
