import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import ChoiceActions from './choice-actions';

export const metadata = {
  title: 'Get Started | Coralum Care',
  description: 'Choose how you would like to set up your Coralum Care account.',
};

export default async function OnboardingChoicePage() {
  const { userId } = await getSession();

  if (!userId) {
    redirect('/signup');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_48%),linear-gradient(135deg,#f8fffb_0%,#eefbf3_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Coralum Care
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How would you like to get started?
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Choose between self-service setup or let our team guide you through the onboarding process.
          </p>
        </div>

        <ChoiceActions />
      </div>
    </main>
  );
}
