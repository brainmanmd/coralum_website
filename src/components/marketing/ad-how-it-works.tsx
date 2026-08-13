import Image from 'next/image';

export type AdStep = {
  number: string;
  color: string;
  title: string;
  description: string;
};

export default function AdHowItWorks({
  heroImage,
  heroImageAlt,
  steps,
}: {
  heroImage: string;
  heroImageAlt: string;
  steps: AdStep[];
}) {
  return (
    <section id="how-it-works" className="bg-coralum-navy/[0.02] py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 px-6 lg:flex-row">
        <div className="w-full max-w-[415px] shrink-0 overflow-hidden rounded-2xl border border-coralum-navy/10 shadow-[0_10px_24px_0_rgba(0,0,0,0.05)]">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            width={415}
            height={468}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-8">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
              How it works
            </p>
            <h2 className="mt-3 font-serif text-4xl text-coralum-navy">
              Specialized care between visits available anytime, anywhere
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-4 rounded-2xl border border-coralum-navy/10 bg-white p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf5f2]">
                  <span className={`font-label text-sm ${step.color}`}>{step.number}</span>
                </div>
                <div>
                  <h3 className="font-body text-lg font-medium text-coralum-navy">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-coralum-slate">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-body text-lg font-medium text-coralum-navy">
            Our Care Team and AI-assisted support is just a call or text away.
          </p>
        </div>
      </div>
    </section>
  );
}
