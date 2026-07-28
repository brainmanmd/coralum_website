import Image from 'next/image';
import Link from 'next/link';
import { LinkedInBadge } from './icons';

export default function Footer() {
  return (
    <footer className="border-t border-coralum-navy/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">


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
    </footer>
  );
}
