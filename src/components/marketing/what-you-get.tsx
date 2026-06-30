import { ZapIcon, BarChartIcon, HomeIcon, UsersIcon } from './icons';

const features = [
  {
    icon: ZapIcon,
    iconBg: 'bg-coralum-blue/[0.09] text-coralum-blue',
    title: 'Fewer surprises',
    description:
      'Changes in your symptoms are caught earlier, so our care team can respond — not just react.',
  },
  {
    icon: BarChartIcon,
    iconBg: 'bg-coralum-sage/[0.09] text-coralum-sage',
    title: 'Less guesswork',
    description:
      'Our care team has real data, not just what you remember from last week.',
  },
  {
    icon: HomeIcon,
    iconBg: 'bg-coralum-peach/[0.09] text-coralum-peach',
    title: 'Care at home',
    description: 'Support wherever you are, whenever you need it, not only in the clinic.',
  },
  {
    icon: UsersIcon,
    iconBg: 'bg-coralum-navy/[0.09] text-coralum-navy',
    title: 'More freedom',
    description:
      'Less time lost to uncontrolled symptoms, more time with your family and the things you love.',
  },
];

export default function WhatYouGet() {
  return (
    <section className="border-t border-coralum-navy/10 bg-coralum-navy/[0.02] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-slate">
          For patients &amp; families
        </p>
        <h2 className="mt-3 font-serif text-4xl text-coralum-navy">
          What you get with Coralum.
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-xl border border-coralum-navy/10 bg-white p-6"
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${feature.iconBg}`}>
                <feature.icon className="size-[18px]" />
              </div>
              <div>
                <h3 className="font-body text-base font-medium text-coralum-navy">
                  {feature.title}
                </h3>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-coralum-slate">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full border border-coralum-navy/10 bg-[#ebf5f2] px-5 py-2.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-coralum-blue font-body text-[10px] font-bold text-white">
              M
            </span>
            <span className="font-body text-sm text-coralum-navy">
              Covered by Medicare and other health plans.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
