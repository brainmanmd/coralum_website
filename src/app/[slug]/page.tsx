import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/marketing/nav';
import Footer from '@/components/marketing/footer';
import { ArrowRightIcon, CheckSmallIcon } from '@/components/marketing/icons';
import { getLandingPage, landingPages } from '@/lib/landing/pages';

// Only the slugs defined in src/lib/landing/pages.ts are served; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://coralum.ai/${page.slug}`,
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

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    notFound();
  }

  const related = page.related
    .map((relatedSlug) => getLandingPage(relatedSlug))
    .filter((relatedPage): relatedPage is NonNullable<typeof relatedPage> => Boolean(relatedPage));

  return (
    <>
      <Nav />

      <main className="bg-coralum-cream">
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: page.h1,
            headline: page.title,
            description: page.description,
            url: `https://coralum.ai/${page.slug}`,
            inLanguage: 'en',
            about: {
              '@type': 'MedicalCondition',
              name: "Parkinson's disease",
            },
            publisher: {
              '@type': 'MedicalOrganization',
              name: 'Coralum',
              url: 'https://coralum.ai',
            },
          })}
        </script>

        {/* Hero */}
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,rgba(131,188,169,0.14),rgba(66,94,85,0.06)_38%,transparent_72%)] py-20">
          <div className="pointer-events-none absolute -right-24 top-24 size-80 rounded-full bg-coralum-peach opacity-20 blur-[100px]" />
          <div className="relative mx-auto max-w-3xl px-6">
            <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-coralum-navy sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 font-serif text-xl italic text-coralum-navy/70">{page.subhead}</p>
          </div>
        </section>

        {/* Quotable answer block */}
        <section className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-coralum-navy/10 bg-white p-7 sm:p-8">
            <p className="font-body text-lg leading-relaxed text-coralum-navy">{page.answer}</p>
          </div>
        </section>

        {/* Body sections */}
        <article className="mx-auto max-w-3xl px-6 pb-4 pt-16">
          {page.sections.map((section) => (
            <section key={section.heading} className="mb-14">
              <h2 className="font-serif text-2xl text-coralum-navy sm:text-3xl">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 font-body text-base leading-relaxed text-coralum-slate"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* Key points */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="rounded-2xl border border-coralum-navy/10 bg-coralum-navy/[0.02] p-7 sm:p-8">
            <h2 className="font-serif text-2xl text-coralum-navy">Key points</h2>
            <ul className="mt-5 flex flex-col gap-3.5">
              {page.keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-coralum-sage/20 text-coralum-sage">
                    <CheckSmallIcon className="size-2.5" />
                  </span>
                  <span className="font-body text-base leading-relaxed text-coralum-slate">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-coralum-navy/10 bg-white py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <h2 className="font-serif text-3xl text-coralum-navy sm:text-4xl">
              Be the first to experience better Parkinson&apos;s care
            </h2>
            <p className="mt-4 max-w-xl font-body text-base text-coralum-slate">
              Coralum is lightweight support between your doctor&apos;s visits. Join the waitlist for
              early access.
            </p>
            <Link
              href="/waitlist"
              className="mt-8 flex items-center gap-2.5 rounded-full bg-coralum-navy px-7 py-3.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
            >
              Join the Waitlist
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* Related pages — internal linking */}
        {related.length > 0 && (
          <section className="border-t border-coralum-navy/10 py-16">
            <div className="mx-auto max-w-3xl px-6">
              <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
                Keep reading
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((relatedPage) => (
                  <Link
                    key={relatedPage.slug}
                    href={`/${relatedPage.slug}`}
                    className="group rounded-2xl border border-coralum-navy/10 bg-white p-6 transition hover:border-coralum-navy/20"
                  >
                    <p className="font-label text-[10px] uppercase tracking-[0.1em] text-coralum-slate">
                      {relatedPage.eyebrow}
                    </p>
                    <h3 className="mt-2.5 font-serif text-lg text-coralum-navy">
                      {relatedPage.h1}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-body text-sm text-coralum-blue">
                      Read more
                      <ArrowRightIcon className="size-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <p className="font-body text-sm leading-relaxed text-coralum-slate/80">
            This page is general educational information about Parkinson&apos;s disease and is not
            medical advice. Symptoms and treatment differ from person to person — talk with your
            neurologist or care team about your own situation. If you have urgent symptoms, contact
            your care team or emergency services.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
