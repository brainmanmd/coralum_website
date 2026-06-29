'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChoiceActions() {
  const router = useRouter();
  const [showCalendly, setShowCalendly] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleSelfService = () => {
    recordChoice('self_service');
    router.push('/onboarding');
  };

  const handlePhoneCall = () => {
    setShowCalendly(true);
  };

  const handleCalendlyBook = () => {
    setBooked(true);
    recordChoice('phone_call');
  };

  const recordChoice = async (choice: string) => {
    try {
      await fetch('/api/onboarding/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });
    } catch {
      // non-blocking, best effort
    }
  };

  if (booked) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-emerald-900">
            Great! We&apos;ll call you at the time you selected.
          </h2>
          <p className="mt-2 text-emerald-800">
            In the meantime, you can explore your dashboard and get familiar with Coralum Care.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="block rounded-full bg-emerald-600 px-6 py-3 text-center font-medium text-white transition hover:bg-emerald-700"
        >
          Continue to Dashboard
        </Link>
      </div>
    );
  }

  if (showCalendly) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowCalendly(false)}
          className="rounded-full border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          ← Back
        </button>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="mb-6 text-2xl font-semibold">Schedule a Call</h2>
          <div className="flex min-h-[200px] items-center justify-center">
            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCalendlyBook}
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Click here to schedule your onboarding call →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <button
        onClick={handleSelfService}
        className="group rounded-2xl border-2 border-slate-200 bg-white p-8 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200">
            <span className="text-xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            Connect Wearables Myself
          </h3>
          <p className="text-slate-600">
            Choose and connect your health devices now. Takes 5–10 minutes.
          </p>
          <p className="pt-4 text-sm font-medium text-emerald-600">
            Get started →
          </p>
        </div>
      </button>

      <button
        onClick={handlePhoneCall}
        className="group rounded-2xl border-2 border-slate-200 bg-white p-8 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200">
            <span className="text-xl">📞</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            Schedule a Call with Our Team
          </h3>
          <p className="text-slate-600">
            Let our team guide you through setup. Pick a time that works for you.
          </p>
          <p className="pt-4 text-sm font-medium text-emerald-600">
            Schedule now →
          </p>
        </div>
      </button>
    </div>
  );
}
