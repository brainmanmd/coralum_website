import Link from 'next/link';
import { LinkedInBadge } from './icons';
import { landingPages } from '@/lib/landing/pages';

export default function Footer() {
  return (
    <footer className="border-t border-coralum-navy/10">
      <div className="mx-auto max-w-6xl px-6">
        {landingPages.length > 0 && (
          <div className="border-b border-coralum-navy/[0.06] py-10">
            <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
              Learn
            </p>
            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
              {landingPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="font-body text-sm text-coralum-slate hover:text-coralum-navy"
                >
                  {page.eyebrow}: {page.h1}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
            <Link href="/privacy" className="font-body text-sm text-coralum-slate hover:text-coralum-navy">
              Privacy
            </Link>
            <Link href="/terms" className="font-body text-sm text-coralum-slate hover:text-coralum-navy">
              Terms
            </Link>
            <Link href="/contact" className="font-body text-sm text-coralum-slate hover:text-coralum-navy">
              Contact
            </Link>
            <a
              href="https://www.linkedin.com/company/coralumhealth/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Coralum on LinkedIn"
            >
              <LinkedInBadge />
            </a>
          </div>

          <p className="font-label text-[10px] text-coralum-slate">
            © 2026 Coralum · Parkinson&apos;s Care Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
