'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CheckIcon, CheckSmallIcon } from '@/components/marketing/icons';

type FormState = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  zipCode: string;
  insuranceProvider: string;
  contactConsent: boolean;
  betaConsent: boolean;
};

const initialState: FormState = {
  fullName: '',
  email: '',
  dateOfBirth: '',
  zipCode: '',
  insuranceProvider: '',
  contactConsent: false,
  betaConsent: false,
};

function Checkbox({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className="flex w-full items-start gap-3 rounded-lg border border-coralum-navy/10 bg-white p-4 text-left transition hover:border-coralum-navy/20"
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border-2 transition ${
          checked
            ? 'border-coralum-navy bg-coralum-navy'
            : 'border-coralum-navy/10 bg-coralum-cream'
        }`}
      >
        {checked && <CheckSmallIcon className="size-3 text-white" />}
      </span>
      <span className="flex-1 font-body text-sm font-medium text-coralum-navy">
        {label}
      </span>
    </button>
  );
}

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.contactConsent) {
      setError('Please consent to be contacted to join the waitlist.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          date_of_birth: form.dateOfBirth,
          zip_code: form.zipCode,
          insurance_provider: form.insuranceProvider,
          contact_consent: form.contactConsent,
          beta_consent: form.betaConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setCompleted(true);
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex w-full max-w-[480px] flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-coralum-navy">
          <CheckIcon className="size-8 text-white" />
        </div>
        <h1 className="font-serif text-3xl text-coralum-navy">
          You&apos;re on the list!
        </h1>
        <p className="font-body text-base text-coralum-slate">
          Thank you for joining Coralum&apos;s waitlist. We&apos;ll be in touch as
          soon as we&apos;re ready to transform Parkinson&apos;s care for you.
        </p>
        <p className="font-body text-sm text-coralum-slate/85">
          In the meantime, feel free to reach out to us at{' '}
          <a href="mailto:hello@coralum.com" className="underline">
            hello@coralum.com
          </a>{' '}
          with any questions.
        </p>
        <Link
          href="/"
          className="flex h-[52px] w-full items-center justify-center rounded-lg bg-coralum-navy font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[480px] flex-col items-start gap-6"
    >
      <div className="flex w-full flex-col gap-2">
        <h1 className="font-serif text-3xl text-coralum-navy">Join the Waitlist</h1>
        <p className="font-body text-sm text-coralum-slate">
          Sign up to stay informed and get more details as Coralum launches.
        </p>
      </div>

      {error && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 font-body text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="font-body text-sm font-medium text-coralum-navy">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your name and last name"
            className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy placeholder-coralum-slate focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-body text-sm font-medium text-coralum-navy">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy placeholder-coralum-slate focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateOfBirth" className="font-body text-sm font-medium text-coralum-navy">
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={form.dateOfBirth}
            onChange={handleChange}
            className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="zipCode" className="font-body text-sm font-medium text-coralum-navy">
            ZIP / Postal code
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            required
            value={form.zipCode}
            onChange={handleChange}
            placeholder="94301"
            className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy placeholder-coralum-slate focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="insuranceProvider" className="font-body text-sm font-medium text-coralum-navy">
            Insurance provider
          </label>
          <p className="font-body text-xs text-coralum-slate">
            For informational purposes only
          </p>
          <input
            id="insuranceProvider"
            name="insuranceProvider"
            type="text"
            value={form.insuranceProvider}
            onChange={handleChange}
            placeholder="e.g. Medicare, Aetna, Blue Cross"
            className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy placeholder-coralum-slate focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
          />
        </div>
      </div>

      <Checkbox
        checked={form.contactConsent}
        onClick={() =>
          setForm((prev) => ({ ...prev, contactConsent: !prev.contactConsent }))
        }
        label="I consent to be contacted by Coralum with updates."
      />

      <Checkbox
        checked={form.betaConsent}
        onClick={() =>
          setForm((prev) => ({ ...prev, betaConsent: !prev.betaConsent }))
        }
        label="I'd like to sign up to share my experience and test the product."
      />

      <button
        type="submit"
        disabled={loading}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-coralum-navy font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90 disabled:opacity-50"
      >
        {loading ? 'Joining...' : 'Join the Waitlist'}
        {!loading && <ArrowRightIcon className="size-3.5" />}
      </button>

      <p className="font-body text-xs text-coralum-slate">Your data is protected.</p>
    </form>
  );
}
