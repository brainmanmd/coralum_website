import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/waitlist/waitlist-form';
import { ChevronLeftIcon } from '@/components/marketing/icons';

export const metadata = {
  title: 'Join the Waitlist | Coralum',
  description:
    "Sign up for Coralum's waitlist to be among the first to experience AI-enabled care for Parkinson's Disease.",
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
              width={35}
              height={32}
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
