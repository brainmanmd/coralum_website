'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, CloseIcon, MenuIcon } from './icons';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

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

        <nav className="hidden items-center gap-7 md:flex">
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
          className="hidden items-center gap-2 rounded-full bg-coralum-navy px-5 py-2 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90 md:flex"
        >
          Join the Waitlist
          <ArrowRightIcon className="size-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="flex items-center justify-center text-coralum-navy md:hidden"
        >
          {isOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-coralum-navy/[0.06] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="font-body text-sm text-coralum-slate transition hover:text-coralum-navy"
            >
              How it works
            </a>
            <a
              href="#team"
              onClick={() => setIsOpen(false)}
              className="font-body text-sm text-coralum-slate transition hover:text-coralum-navy"
            >
              Meet the Team
            </a>
            <div className="mt-2 border-t border-coralum-navy/10 pt-4">
              <Link
                href="/waitlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-coralum-navy px-5 py-2.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
              >
                Join the Waitlist
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
