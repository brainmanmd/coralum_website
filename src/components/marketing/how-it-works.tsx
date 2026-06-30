const steps = [
  {
    number: '01',
    color: 'border-coralum-blue text-coralum-blue',
    title: 'Connect',
    description:
      "Sign up to get started and schedule a brief onboarding call. You keep your existing doctor and gain access to our specialized care team.",
  },
  {
    number: '02',
    color: 'border-coralum-sage text-coralum-sage',
    title: 'Track & Engage',
    description:
      'Symptoms are monitored regularly from home, using clinically validated tools built for everyday life.',
  },
  {
    number: '03',
    color: 'border-coralum-peach text-coralum-peach',
    title: 'Proactive Support',
    description:
      'Our care team monitors your data between visits and can act sooner — before a small change becomes a big problem.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-coralum-cream py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl text-coralum-navy">
          Lightweight engagement, built to help you live better, between your
          doctor&apos;s visits
        </h2>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
          <div className="absolute top-7 left-0 hidden h-px w-full bg-coralum-navy/10 sm:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col gap-5">
              <div
                className={`flex size-14 items-center justify-center rounded-full border-2 bg-coralum-cream ${step.color}`}
              >
                <span className="font-label text-sm">{step.number}</span>
              </div>
              <div>
                <h3 className="font-body text-lg font-medium text-coralum-navy">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-coralum-slate">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
