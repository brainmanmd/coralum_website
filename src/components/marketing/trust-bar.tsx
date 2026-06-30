import Image from 'next/image';

export default function TrustBar() {
  return (
    <section className="border-y border-coralum-navy/10 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center font-label text-[10px] uppercase tracking-[0.1em] text-coralum-slate">
          Backed by &amp; affiliated with
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <Image
            src="/images/partners/stanford-university.png"
            alt="Stanford University"
            width={122}
            height={68}
            className="h-12 w-auto opacity-80"
          />
          <span className="hidden h-10 w-px bg-coralum-navy/10 sm:block" />
          <Image
            src="/images/partners/stanford-biodesign.png"
            alt="Stanford Mussallem Center for Biodesign"
            width={146}
            height={68}
            className="h-12 w-auto opacity-80"
          />
          <span className="hidden h-10 w-px bg-coralum-navy/10 sm:block" />
          <Image
            src="/images/partners/2048-ventures.png"
            alt="2048 Ventures"
            width={68}
            height={68}
            className="h-12 w-auto opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
