'use client';

import { useRef, useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { US_STATES, validateEmail, validateFullName, validateState } from '@/lib/waitlist/validation';

type FieldErrors = {
  name?: string;
  email?: string;
  state?: string;
  consent?: string;
};

export default function WaitlistLandingForm({ source }: { source: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [consent, setConsent] = useState(false);
  const [testingInterest, setTestingInterest] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors: FieldErrors = {};
    if (!validateFullName(name)) nextErrors.name = 'Enter your full name.';
    if (!validateEmail(email)) nextErrors.email = 'Enter a valid email address.';
    if (!validateState(state)) nextErrors.state = 'Select your state.';
    if (!consent) nextErrors.consent = 'You must consent to be contacted to join the waitlist.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email,
          state,
          contact_consent: consent,
          testing_interest: testingInterest,
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      sendGAEvent('event', 'waitlist_signup', {
        state,
        testing_interest: testingInterest,
        landing_page: source,
      });

      setSubmitted(true);
    } catch {
      setSubmitError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <div className="cor-note">
          <span className="cor-note__label">Recorded</span>
          <p className="cor-note__body">
            You&apos;re on the list. We&apos;ll be in touch as soon as we&apos;re ready to
            transform Parkinson&apos;s care for you.
          </p>
        </div>
        <p style={{ margin: '16px 0 0', fontSize: 17, lineHeight: '26px', color: 'var(--slate)' }}>
          In the meantime, feel free to reach out to us at{' '}
          <a href="mailto:hello@coralum.ai">hello@coralum.ai</a> with any questions.
        </p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter(([, v]) => v) as Array<
    [keyof FieldErrors, string]
  >;
  const fieldIdFor: Record<keyof FieldErrors, string> = {
    name: 'f-name',
    email: 'f-email',
    state: 'f-state',
    consent: 'f-consent',
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {errorEntries.length > 0 && (
          <div
            className="cor-summary"
            role="alert"
            tabIndex={-1}
            ref={summaryRef}
          >
            <h3 className="cor-summary__title">There is a problem</h3>
            <ul className="cor-summary__list">
              {errorEntries.map(([key, message]) => (
                <li key={key}>
                  <a href={`#${fieldIdFor[key]}`}>{message}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {submitError && (
          <div className="cor-summary" role="alert">
            <p style={{ margin: 0 }}>{submitError}</p>
          </div>
        )}

        <div className="cor-field" data-field="f-name">
          <label className="cor-field__label" htmlFor="f-name">
            Full name
          </label>
          {errors.name && (
            <span className="cor-field__error">
              <span aria-hidden="true">▲</span>
              <span>
                <span className="cor-visually-hidden">Error: </span>
                {errors.name}
              </span>
            </span>
          )}
          <input
            autoComplete="name"
            id="f-name"
            className="cor-field__input"
            aria-invalid={errors.name ? 'true' : 'false'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="cor-field" data-field="f-email">
          <label className="cor-field__label" htmlFor="f-email">
            Email address
          </label>
          {errors.email && (
            <span className="cor-field__error">
              <span aria-hidden="true">▲</span>
              <span>
                <span className="cor-visually-hidden">Error: </span>
                {errors.email}
              </span>
            </span>
          )}
          <input
            type="email"
            autoComplete="email"
            id="f-email"
            className="cor-field__input"
            aria-invalid={errors.email ? 'true' : 'false'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="cor-field" data-field="f-state">
          <label className="cor-field__label" htmlFor="f-state">
            State
          </label>
          {errors.state && (
            <span className="cor-field__error">
              <span aria-hidden="true">▲</span>
              <span>
                <span className="cor-visually-hidden">Error: </span>
                {errors.state}
              </span>
            </span>
          )}
          <select
            id="f-state"
            className="cor-field__input cor-select"
            aria-invalid={errors.state ? 'true' : 'false'}
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Select your state</option>
            {US_STATES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="cor-consents" data-field="f-consent">
          <label className="cor-consent">
            <input
              type="checkbox"
              id="f-consent"
              className="cor-consent__box"
              aria-invalid={errors.consent ? 'true' : 'false'}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>I consent to be contacted by Coralum with updates.</span>
          </label>
          <label className="cor-consent">
            <input
              type="checkbox"
              id="f-testing"
              className="cor-consent__box"
              checked={testingInterest}
              onChange={(e) => setTestingInterest(e.target.checked)}
            />
            <span>I&apos;d like to sign up to share my experience and test the product.</span>
          </label>
          {errors.consent && (
            <span className="cor-field__error">
              <span aria-hidden="true">▲</span>
              <span>
                <span className="cor-visually-hidden">Error: </span>
                {errors.consent}
              </span>
            </span>
          )}
        </div>

        <div>
          <button className="cor-btn cor-btn--primary" type="submit" disabled={loading}>
            <span className="cor-btn__label">{loading ? 'Joining…' : 'Join the waitlist'}</span>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p
          style={{
            margin: 0,
            paddingTop: 16,
            borderTop: '1px solid var(--hairline)',
            fontSize: 16,
            lineHeight: '24px',
            color: 'var(--slate)',
          }}
        >
          We use your details to tell you when Coralum opens and, if you tick the box, to send
          updates. Nothing else. <a href="/privacy">Privacy notice</a>
        </p>
      </div>
    </form>
  );
}
