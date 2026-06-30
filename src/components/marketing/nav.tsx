import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from './icons';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-coralum-navy/[0.06] bg-coralum-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Coralum home">
          <Image
            src="/images/coralum-logo.png"
            alt="Coralum"
            width={35}
            height={32}
            priority
          />
        </Link>

        <nav className="flex items-center gap-7">
          <a href="#how-it-works" className="font-body text-sm text-coralum-slate transition hover:text-coralum-navy">
            How it works
          </a>
          <Link href="/waitlist" className="font-body text-sm text-coralum-slate transition hover:text-coralum-navy">
            Join Waitlist
          </Link>
          <a href="#team" className="font-body text-sm text-coralum-slate transition hover:text-coralum-navy">
            Meet the Team
          </a>
        </nav>

        <Link
          href="/waitlist"
          className="flex items-center gap-2 rounded-full bg-coralum-navy px-5 py-2 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
        >
          Join the Waitlist
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}
