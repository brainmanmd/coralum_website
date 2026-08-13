'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { ArrowRightIcon, CheckIcon, CheckSmallIcon } from '@/components/marketing/icons';
import { PARKINSONS_DURATION_OPTIONS } from '@/lib/waitlist/validation';

type JoiningAs = 'patient' | 'caregiver';

type FormState = {
  joiningAs: JoiningAs | null;
  patientName: string;
  caregiverName: string;
  email: string;
  dateOfBirth: string;
  zipCode: string;
  insuranceProvider: string;
  parkinsonsDuration: string;
  usesWearable: boolean | null;
  wearableDevice: string;
  contactConsent: boolean;
  betaConsent: boolean;
};

const initialState: FormState = {
  joiningAs: null,
  patientName: '',
  caregiverName: '',
  email: '',
  dateOfBirth: '',
  zipCode: '',
  insuranceProvider: '',
  parkinsonsDuration: '',
  usesWearable: null,
  wearableDevice: '',
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

function OptionButton({
  selected,
  onClick,
  label,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex items-center gap-2.5 rounded-lg px-3.5 py-[11px] text-left transition ${
        selected
          ? 'bg-coralum-navy text-white'
          : 'border border-coralum-navy/10 bg-white text-coralum-navy hover:border-coralum-navy/20'
      } ${className ?? 'w-full'}`}
    >
      <span className="flex-1 font-body text-sm">{label}</span>
      {selected && <CheckSmallIcon className="size-3 shrink-0 text-white" />}
    </button>
  );
}

function TextField({
  id,
  label,
  helperText,
  ...inputProps
}: {
  id: string;
  label: string;
  helperText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm font-medium text-coralum-navy">
        {label}
      </label>
      {helperText && (
        <p className="font-body text-xs text-coralum-slate">{helperText}</p>
      )}
      <input
        id={id}
        name={id}
        className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy placeholder-coralum-slate focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
        {...inputProps}
      />
    </div>
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

    if (!form.joiningAs) {
      setError('Please tell us who you are joining as.');
      return;
    }

    if (!form.contactConsent) {
      setError('Please consent to be contacted to join the waitlist.');
      return;
    }

    if (form.usesWearable === null) {
      setError('Please answer the wearable/smartwatch question.');
      return;
    }

    if (form.usesWearable && !form.wearableDevice.trim()) {
      setError('Please tell us which device you use.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          joining_as: form.joiningAs,
          patient_name: form.patientName,
          caregiver_name: form.joiningAs === 'caregiver' ? form.caregiverName : undefined,
          email: form.email,
          date_of_birth: form.dateOfBirth,
          zip_code: form.zipCode,
          insurance_provider: form.insuranceProvider,
          parkinsons_duration: form.parkinsonsDuration,
          uses_wearable: form.usesWearable,
          wearable_device: form.usesWearable ? form.wearableDevice : undefined,
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

      sendGAEvent('event', 'waitlist_signup', {
        joining_as: form.joiningAs,
        landing_page: window.location.pathname,
      });

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
          <a href="mailto:hello@coralum.ai" className="text-coralum-blue underline">
            hello@coralum.ai
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

  const isCaregiver = form.joiningAs === 'caregiver';
  const isPatient = form.joiningAs === 'patient';

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

      <div className="flex w-full flex-col gap-2">
        <p className="font-body text-sm font-medium text-coralum-navy">I am joining as a</p>
        <OptionButton
          selected={isPatient}
          onClick={() => setForm((prev) => ({ ...prev, joiningAs: 'patient' }))}
          label="Person living with Parkinson's"
        />
        <OptionButton
          selected={isCaregiver}
          onClick={() => setForm((prev) => ({ ...prev, joiningAs: 'caregiver' }))}
          label="Caregiver or family member"
        />
      </div>

      {form.joiningAs && (
        <>
          <div className="flex w-full flex-col gap-4">
            {isCaregiver && (
              <TextField
                id="caregiverName"
                label="Your name"
                type="text"
                required
                value={form.caregiverName}
                onChange={handleChange}
                placeholder="Your name and last name"
              />
            )}

            <TextField
              id="patientName"
              label={
                isCaregiver
                  ? "Name of the person living with Parkinson's you're signing up"
                  : 'Full name'
              }
              type="text"
              required
              value={form.patientName}
              onChange={handleChange}
              placeholder={isCaregiver ? 'Their name and last name' : 'Your name and last name'}
            />

            <TextField
              id="email"
              label="Email address"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />

            <TextField
              id="dateOfBirth"
              label={isCaregiver ? "Date of birth of the person you're signing up" : 'Date of birth'}
              type="date"
              required
              value={form.dateOfBirth}
              onChange={handleChange}
            />

            <TextField
              id="zipCode"
              label="ZIP / Postal code"
              type="text"
              required
              value={form.zipCode}
              onChange={handleChange}
              placeholder="94301"
            />

            <TextField
              id="insuranceProvider"
              label="Insurance provider"
              helperText="Used only to verify coverage. You're not signing up for anything at this stage."
              type="text"
              value={form.insuranceProvider}
              onChange={handleChange}
              placeholder="e.g. Medicare, Aetna, Blue Cross"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="parkinsonsDuration" className="font-body text-sm font-medium text-coralum-navy">
                {isCaregiver
                  ? "How long has your loved one been living with Parkinson's?"
                  : "How long have you been living with Parkinson's?"}
              </label>
              <select
                id="parkinsonsDuration"
                name="parkinsonsDuration"
                required
                value={form.parkinsonsDuration}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, parkinsonsDuration: e.target.value }))
                }
                className="h-[42px] w-full rounded-lg border border-coralum-navy/10 bg-white px-3.5 font-body text-sm text-coralum-navy focus:border-coralum-blue focus:outline-none focus:ring-2 focus:ring-coralum-blue/20"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {PARKINSONS_DURATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-body text-sm font-medium text-coralum-navy">
                {isCaregiver
                  ? 'Do they wear a smartwatch or fitness tracker?'
                  : 'Do you currently use a wearable or a smartwatch?'}
              </p>
              <div className="flex w-full gap-3">
                <OptionButton
                  selected={form.usesWearable === true}
                  onClick={() => setForm((prev) => ({ ...prev, usesWearable: true }))}
                  label="Yes"
                  className="flex-1 justify-center"
                />
                <OptionButton
                  selected={form.usesWearable === false}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, usesWearable: false, wearableDevice: '' }))
                  }
                  label="No"
                  className="flex-1 justify-center"
                />
              </div>

              {form.usesWearable && (
                <TextField
                  id="wearableDevice"
                  label="Which device?"
                  type="text"
                  required
                  value={form.wearableDevice}
                  onChange={handleChange}
                  placeholder="Apple Watch, Fitbit, Oura Ring, Garmin, Whoop, Other"
                />
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-xl border border-coralum-navy/[0.06] bg-[#f7f5f0] p-5">
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
          </div>

          <p className="font-body text-xs text-coralum-slate">Your data is protected.</p>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-coralum-navy font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90 disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join the Waitlist'}
            {!loading && <ArrowRightIcon className="size-3.5" />}
          </button>
        </>
      )}
    </form>
  );
}
