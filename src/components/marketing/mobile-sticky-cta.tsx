'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from './icons';

// Appears once the visitor has scrolled past the hero's own CTA, so it
// doesn't duplicate a button that's already on screen.
const SCROLL_THRESHOLD = 420;

export default function MobileStickyCta({ source }: { source: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-coralum-navy/10 bg-coralum-cream/95 p-3 backdrop-blur transition-transform duration-200 sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href={`/waitlist?source=${encodeURIComponent(source)}`}
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-coralum-navy px-7 py-3.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
      >
        Join the Waitlist
        <ArrowRightIcon className="size-3.5" />
      </Link>
    </div>
  );
}
