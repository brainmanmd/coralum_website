import Link from 'next/link';
import './waitlist-landing.css';
import WaitlistLandingInteractions from './waitlist-landing-interactions';
import WaitlistLandingForm from './waitlist-landing-form';
import ScrollDepthTracker from './scroll-depth-tracker';

const ArrowIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 6 8 10.5 12.5 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#questions', label: 'Questions' },
  { href: '#team', label: 'Meet the team' },
];

function Nav() {
  return (
    <header
      className="cor-nav"
      data-nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--hairline)',
        height: 72,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 28px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <a
          href="#top"
          aria-label="Coralum — back to home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, textDecoration: 'none', color: 'var(--ink)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/waitlist/coralum-wordmark.png"
            alt="Coralum Health"
            style={{ height: 36, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`cor-h${i + 1}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 44,
                padding: '0 12px',
                fontSize: 17,
                fontWeight: 500,
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <a href="#waitlist" className="cor-btn cor-btn--primary">
            <span className="cor-btn__label">Join the waitlist</span>
          </a>
          <button
            type="button"
            className="cor-navtoggle"
            data-nav-toggle
            aria-expanded="false"
            aria-controls="cor-menu"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                className="cor-navtoggle__bars"
                d="M3 6.5h14M3 10h14M3 13.5h14"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                className="cor-navtoggle__cross"
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="cor-menu" id="cor-menu" data-nav-menu hidden>
        <nav className="cor-menu__links" aria-label="Sections">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="cor-menu__foot" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="cor-runway" data-runway>
      <div className="cor-stage" data-stage>
        <div className="cor-expand">
          <div className="cor-cardmark" data-mark-card aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cor-wordmark" src="/images/waitlist/coralum-wordmark.png" alt="" />
          </div>
          <section id="top" style={{ scrollMarginTop: 80, padding: '96px 0 88px' }}>
            <div
              className="cor-hero-grid"
              style={{
                maxWidth: 1320,
                margin: '0 auto',
                padding: '0 28px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))',
                gap: 72,
                alignItems: 'center',
              }}
            >
              <div>
                <h1
                  style={{
                    margin: '0 0 24px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 56,
                    lineHeight: '62px',
                    letterSpacing: '-1.5px',
                  }}
                >
                  Parkinson&apos;s care that keeps up with you.
                </h1>
                <p
                  style={{
                    margin: '0 0 36px',
                    fontSize: 20,
                    lineHeight: '30px',
                    color: 'var(--slate)',
                    maxWidth: '34em',
                  }}
                >
                  Coralum watches for changes at home, so a specialist team can act before your
                  next visit. All covered by your insurance.
                </p>
                <div style={{ margin: '0 0 28px' }}>
                  <a href="#how-it-works" className="cor-btn cor-btn--secondary">
                    <span className="cor-btn__label">See how it works</span>
                    <ArrowIcon />
                  </a>
                </div>
                <div
                  style={{
                    margin: '32px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px 24px',
                  }}
                >
                  <span style={{ fontSize: 15, color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                    Backed and trusted by
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/waitlist/stanford-university.png"
                      alt="Stanford University"
                      style={{ height: 34, width: 'auto', display: 'block' }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/waitlist/stanford-biodesign.png"
                      alt="Stanford Biodesign"
                      style={{ height: 46, width: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ aspectRatio: '1000/1120', borderRadius: 24, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      data-hero-photo
                      src="/images/waitlist/hero-photo.jpg"
                      alt="An older couple standing together, seen from behind"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="cor-cue" data-cue>
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 3.5v12M4.8 10.6 10 15.8l5.2-5.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StatsBand() {
  return (
    <section style={{ background: 'var(--deep)', color: 'var(--on-ink)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <h2
          style={{
            margin: '0 0 24px',
            maxWidth: '20em',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 42,
            lineHeight: '50px',
            letterSpacing: '-0.8px',
          }}
        >
          Most Parkinson&apos;s care happens in twenty minutes, months apart.
        </h2>
        <p style={{ margin: '0 0 56px', maxWidth: '36em', fontSize: 20, lineHeight: '31px', color: 'var(--on-ink-muted)' }}>
          A great deal changes in between: medication response, tremor, balance, sleep, and more.
          By the next visit, some of it is hard to remember, and some of it has already become a
          problem. Coralum bridges that gap: continuous monitoring, personalized care plans, and
          real data our care team can act on.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '40px 64px', textAlign: 'left' }}>
          <div style={{ flex: '0 0 auto', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
            <p
              style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                lineHeight: '56px',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="cor-visually-hidden">20 minutes</span>
              <span aria-hidden="true">
                <span className="cor-count" data-count-to="20">
                  <span className="cor-count__size">20</span>
                  <span className="cor-count__value">20</span>
                </span>{' '}
                minutes
              </span>
            </p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: '25px', color: 'var(--on-ink-muted)', whiteSpace: 'nowrap' }}>
              A typical neurology appointment
            </p>
          </div>
          <div style={{ flex: '0 0 auto', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
            <p
              style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                lineHeight: '56px',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="cor-visually-hidden">3 to 8 months</span>
              <span aria-hidden="true">
                <span className="cor-count" data-count-to="3">
                  <span className="cor-count__size">3</span>
                  <span className="cor-count__value">3</span>
                </span>{' '}
                to{' '}
                <span className="cor-count" data-count-to="8">
                  <span className="cor-count__size">8</span>
                  <span className="cor-count__value">8</span>
                </span>{' '}
                months
              </span>
            </p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: '25px', color: 'var(--on-ink-muted)', whiteSpace: 'nowrap' }}>
              The wait between those appointments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const SYMPTOMS = [
  'Tremor',
  'Sleep issues',
  'Constipation',
  'Brain fog',
  'Mood and focus',
  'Balance and rigidity',
  'Dyskinesia',
];

function Symptoms() {
  return (
    <section id="symptoms" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <div
          className="cor-symcard"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 16,
            padding: 64,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))',
            gap: '32px 72px',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 34,
                lineHeight: '39px',
                letterSpacing: '-0.6px',
              }}
            >
              Parkinson&apos;s symptoms are not always visible.
            </h2>
            <p style={{ margin: 0, maxWidth: '34em', fontSize: 18, lineHeight: '29px', color: 'var(--slate)' }}>
              Coralum helps identify changes that are easy to miss, including sleep disruptions,
              constipation, and more.
            </p>
          </div>
          <ul
            aria-label="Symptoms Coralum watches for"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
              gap: '0 32px',
            }}
          >
            {SYMPTOMS.map((symptom) => (
              <li
                key={symptom}
                style={{
                  margin: 0,
                  borderTop: '1px solid var(--hairline)',
                  padding: '18px 0',
                  fontSize: 19,
                  fontWeight: 500,
                  lineHeight: '27px',
                }}
              >
                {symptom}
              </li>
            ))}
            <li
              style={{
                margin: 0,
                borderTop: '1px solid var(--hairline)',
                padding: '18px 0',
                fontSize: 19,
                fontWeight: 500,
                lineHeight: '27px',
                color: 'var(--slate)',
              }}
            >
              And more
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: '01',
    title: 'Sign up and connect with our care team.',
    body: "Answer a few questions and see one of our specialists, who'll get the full picture of your symptoms.",
    image: '/images/waitlist/step-1.jpg',
    alt: 'A hand holding a phone showing the Tell us about yourself screen, example data',
    caption: 'Step 1 · Sign up',
  },
  {
    n: '02',
    title: 'Get a care plan that keeps up with you.',
    body: 'Receive a care plan built around your symptoms and goals.',
    image: '/images/waitlist/step-2.jpg',
    alt: 'A message from Coralum being read on a phone at home, example data',
    caption: 'Step 2 · Frequent check-in',
  },
  {
    n: '03',
    title: 'Access on-demand support whenever you need it.',
    body: 'Our AI-enabled care team, powered by Cora, reaches out proactively and is available when you need assistance.',
    image: '/images/waitlist/step-3.jpg',
    alt: 'A video call with a movement disorder specialist on a laptop at home, example data',
    caption: 'Step 3 · Your care team',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ scrollMarginTop: 80, padding: '96px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <h2
          style={{
            margin: '0 0 56px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 34,
            lineHeight: '39px',
            letterSpacing: '-0.6px',
          }}
        >
          Three steps and less than 10 minutes to get started.
        </h2>
        <div className="cor-stepsgrid">
          <div className="cor-steps" role="tablist" aria-label="The three steps" aria-orientation="vertical">
            {STEPS.map((step, i) => (
              <button
                key={step.n}
                className="cor-step"
                role="tab"
                id={`cor-step-tab-${i + 1}`}
                aria-controls={`cor-step-panel-${i + 1}`}
                aria-selected={i === 0}
                tabIndex={i === 0 ? 0 : -1}
              >
                <span className="cor-step__n" aria-hidden="true">
                  {step.n}
                </span>
                <span>
                  <h3 className="cor-step__t">{step.title}</h3>
                  <p className="cor-step__p">{step.body}</p>
                </span>
              </button>
            ))}
          </div>
          <div className="cor-deck">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="cor-deckcard"
                role="tabpanel"
                id={`cor-step-panel-${i + 1}`}
                aria-labelledby={`cor-step-tab-${i + 1}`}
                data-step={i + 1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={step.alt} />
                <span className="cor-deckcard__cap">{step.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightsPhone() {
  return (
    <div className="cor-phone" aria-label="A Coralum insights screen on a phone, with example data">
      <div className="cor-phone__screen">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--slate)',
          }}
        >
          <span>Weekly check-in</span>
          <span>Week 6</span>
        </div>
        <p
          style={{
            margin: '18px 0 8px',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 24,
            lineHeight: '29px',
            letterSpacing: '-0.4px',
            color: 'var(--ink)',
          }}
        >
          Gait has changed.
        </p>
        <p style={{ margin: '0 0 20px', fontSize: 16, lineHeight: '24px', color: 'var(--slate)' }}>
          Steps slower and less steady, five of the last seven days.
        </p>
        <svg
          viewBox="0 0 300 150"
          role="img"
          aria-label="Eight weekly check-ins on one line. Weeks one to five sit inside the baseline band; week six leaves it and is flagged."
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <rect x="0" y="52" width="300" height="30" rx="4" fill="var(--sage-tint)" />
          <text x="296" y="71" textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.8" fill="var(--sage-text)">
            YOUR BASELINE
          </text>
          <polyline
            points="14,66 54,62 94,70 134,64 174,67 214,104 254,112 290,120"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <g fill="var(--ink)">
            <circle cx="14" cy="66" r="3" />
            <circle cx="54" cy="62" r="3" />
            <circle cx="94" cy="70" r="3" />
            <circle cx="134" cy="64" r="3" />
            <circle cx="174" cy="67" r="3" />
            <circle cx="254" cy="112" r="3" />
            <circle cx="290" cy="120" r="3" />
          </g>
          <circle cx="214" cy="104" r="10" fill="none" stroke="var(--peach-text)" strokeWidth="1.5" />
          <circle cx="214" cy="104" r="5.5" fill="var(--peach)" stroke="var(--surface)" strokeWidth="2" />
          <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--slate)" textAnchor="middle">
            <text x="14" y="146">W1</text>
            <text x="54" y="146">W2</text>
            <text x="94" y="146">W3</text>
            <text x="134" y="146">W4</text>
            <text x="174" y="146">W5</text>
            <text x="214" y="146">W6</text>
            <text x="254" y="146">W7</text>
            <text x="290" y="146">W8</text>
          </g>
        </svg>
        <div
          style={{
            marginTop: 18,
            padding: '14px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--peach-edge)',
            borderRadius: 12,
          }}
        >
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.9px',
              textTransform: 'uppercase',
              color: 'var(--peach-text)',
            }}
          >
            Awaiting your care team
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: 'var(--ink)' }}>
            A nurse will look at this week&apos;s check-in and get back to you.
          </p>
        </div>
      </div>
    </div>
  );
}

function Pillars() {
  return (
    <section id="pillars" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <h2
          style={{
            margin: '0 0 56px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 34,
            lineHeight: '39px',
            letterSpacing: '-0.6px',
          }}
        >
          Care that notices, a team that acts, and everyone kept in the loop.
        </h2>
        <div className="cor-pillars">
          <div className="cor-pillar cor-pillar--lead" style={{ background: 'var(--deep)' }}>
            <div className="cor-pillar__stage">
              <InsightsPhone />
            </div>
            <div>
              <p
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--on-ink-muted)',
                }}
              >
                Insights
              </p>
              <h3
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: '34px',
                  letterSpacing: '-0.4px',
                  color: 'var(--on-ink)',
                }}
              >
                Changes get noticed in days, not months.
              </h3>
              <p style={{ margin: 0, maxWidth: '34em', fontSize: 17, lineHeight: '26px', color: 'var(--on-ink-muted)' }}>
                Your check-ins are compared with your own baseline, and your care plan is updated
                when they show it should be.
              </p>
              <p style={{ margin: '16px 0 0', fontSize: 14, lineHeight: '20px', color: 'var(--on-ink-muted)' }}>
                Screen shows example data.
              </p>
            </div>
          </div>
          <div className="cor-pillar cor-pillar--side" style={{ background: 'var(--surface)', border: '1px solid var(--hairline-strong)' }}>
            <div className="cor-pillar__pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/waitlist/pillar-access.jpg"
                alt="Four clinicians of a movement disorder care team, standing together in a clinic corridor"
              />
            </div>
            <div>
              <p
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--slate)',
                }}
              >
                Access
              </p>
              <h3
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: '34px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                A specialist team that can act.
              </h3>
              <p style={{ margin: 0, fontSize: 17, lineHeight: '26px', color: 'var(--slate)' }}>
                Our specialized clinical team who work in Parkinson&apos;s every day are available
                to answer your questions and adjust your plan.
              </p>
            </div>
          </div>
          <div className="cor-pillar cor-pillar--side" style={{ background: 'var(--mint)' }}>
            <div className="cor-pillar__pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/waitlist/pillar-communication.jpg"
                alt="Illustration: three profiles in navy, blue and sage under an arc of dots"
              />
            </div>
            <div>
              <p
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--slate)',
                }}
              >
                Communication
              </p>
              <h3
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: '34px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                Everyone stays in the loop.
              </h3>
              <p style={{ margin: 0, fontSize: 17, lineHeight: '26px', color: 'var(--slate)' }}>
                You choose whether to share access with family. Your treating physician or
                neurologist gets a summary of what changed before each appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Coverage() {
  return (
    <section
      id="coverage"
      style={{
        scrollMarginTop: 80,
        background: 'var(--surface)',
        borderTop: '1px solid var(--hairline)',
        borderBottom: '1px solid var(--hairline)',
        padding: '96px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 20px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 40,
              lineHeight: '46px',
              letterSpacing: '-0.8px',
            }}
          >
            Coralum is covered by Medicare.
          </h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: '29px', color: 'var(--slate)', maxWidth: '34em' }}>
            We work with Medicare and Medicare Advantage. If you have other insurance, tell us and
            we&apos;ll let you know your options.
          </p>
          <div style={{ marginTop: 28 }}>
            <a href="#waitlist" className="cor-btn cor-btn--secondary">
              <span className="cor-btn__label">Join the waitlist</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
        <div style={{ aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--hairline-strong)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/waitlist/coverage.jpg"
            alt="An older couple talking something over at their kitchen table"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}

function ClosingWaitlist() {
  return (
    <section style={{ padding: '96px 0' }}>
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 40,
              lineHeight: '46px',
              letterSpacing: '-0.8px',
            }}
          >
            Join the waitlist. We&apos;ll tell you when Coralum is available.
          </h2>
        </div>
        <div>
          <div
            id="waitlist"
            style={{
              scrollMarginTop: 88,
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <WaitlistLandingForm source="/" />
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ_GROUPS = [
  {
    label: 'Joining the waitlist',
    items: [
      {
        q: 'What happens after I join the waitlist?',
        a: 'We email you when Coralum opens in your state. You are not committing to anything. When it opens, setting up takes about ten minutes.',
      },
      {
        q: 'Is Coralum available where I live?',
        a: "We're opening state by state. Joining the waitlist is how we know where to go next.",
      },
      {
        q: 'What do I need at home?',
        a: "A phone or tablet, and an internet connection. No device to wear, nothing to install in your home. If you already use a wearable device, we can use that data too if you'd like. We can walk through the details at your first consultation.",
      },
      {
        q: 'Can I stop at any time?',
        a: "Yes. There's no contract and no penalty for leaving.",
      },
    ],
  },
  {
    label: 'Your neurologist and cost',
    items: [
      {
        q: 'Do I have to leave my neurologist?',
        a: "No. Coralum works between your neurologist's appointments, not instead of them. Before each visit, your neurologist receives a summary of what changed.",
      },
      {
        q: "What if I don't have a neurologist?",
        a: "You don't need one. Coralum's care team can support you directly, whether or not you have a neurologist, movement disorder specialist, or primary care doctor. If you do have one, we keep them informed.",
      },
      {
        q: 'What does it cost?',
        a: "We work with Medicare and Medicare Advantage. If you have other insurance, tell us and we'll let you know your options.",
      },
    ],
  },
  {
    label: 'Your care',
    items: [
      {
        q: "Who's on your Coralum care team?",
        a: "Nurse practitioners, neurologists, primary care doctors, registered nurses, and care coordinators who specialize in Parkinson's. A clinician reviews your check-ins and makes every decision about your care.",
      },
      {
        q: 'What support do I receive, and how often?',
        a: 'Check-ins are based on your needs and a personalized care plan, quick and frequent, a few minutes on your phone or tablet. Your care team reviews these year-round, not only before your next appointment, and reaches out if something needs attention.',
      },
      {
        q: 'Can I reach out if I have a question or concern about Parkinson\'s?',
        a: 'Yes. You can message our care team any time, and a clinician will get back to you. For emergencies, contact your local emergency services right away.',
      },
      {
        q: 'What if my symptoms get worse quickly?',
        a: 'Your check-ins are reviewed continuously, not just at your next appointment. If something changes, our care team will reach out to discuss treatment options.',
      },
    ],
  },
  {
    label: 'The app, your family, your information',
    items: [
      {
        q: 'Is this an AI?',
        a: "Coralum is a clinical team supported by an AI companion. The companion checks in with you to see how you're doing and is available any time you have a question about Parkinson's. Our clinical team reviews what it finds and connects with you directly to discuss any treatment recommendations, not the AI companion.",
      },
      {
        q: 'I have a tremor. Can I use it?',
        a: 'Coralum was designed for it. Every button is large, nothing depends on a precise tap, and a check-in can be paused and finished later. Someone helping you can complete a check-in with you.',
      },
      {
        q: 'Can a family member or caregiver set this up for me?',
        a: 'Yes, if you ask them to. They can also set up their own account and ask for access to your profile. You decide what they can see, and you can change it at any time. If you have given someone legal authority for your medical decisions, they can set it up for you.',
      },
      {
        q: 'Who can see my information?',
        a: 'You, the care team looking after you, and anyone you choose to share it with. Coralum is a HIPAA covered entity. Your information is not sold, and it is not used to train other companies\' software.',
      },
    ],
  },
];

function Questions() {
  const [col1, col2] = [FAQ_GROUPS.slice(0, 2), FAQ_GROUPS.slice(2)];
  return (
    <section id="questions" style={{ scrollMarginTop: 80, padding: '0 0 120px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <h2
          style={{
            margin: '0 0 48px',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 34,
            lineHeight: '39px',
            letterSpacing: '-0.6px',
          }}
        >
          Questions people ask before they join.
        </h2>
        <div className="cor-faqs">
          {[col1, col2].map((col, colIdx) => (
            <div className="cor-faqs__col" key={colIdx}>
              {col.map((group) => (
                <div className="cor-faqgroup" key={group.label}>
                  <h3 className="cor-faqgroup__label">{group.label}</h3>
                  {group.items.map((item) => (
                    <details className="cor-faq" key={item.q}>
                      <summary>
                        <h4>{item.q}</h4>
                        <span className="cor-faq__chev" aria-hidden="true">
                          <ChevronIcon />
                        </span>
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FOUNDERS = [
  {
    name: 'Julian Salazar',
    photo: '/images/waitlist/founder-julian.png',
    bio: 'Stanford Biodesign Innovation Fellow, Product Leader and engineer with a track record of launching digital health solutions and connected medical devices in international markets for chronic disease management, in partnership with start-ups, medtech companies and global pharma like Pfizer and Eli Lilly.',
    linkedin: 'https://www.linkedin.com/in/juliansalazarg/',
  },
  {
    name: 'Kevin Cyr, MD',
    photo: '/images/waitlist/founder-kevin.png',
    bio: 'Dr. Kevin Cyr is a Stanford physician and innovator working at the intersection of medicine, venture capital, and digital health. He received his MD from Stanford University, completed his internal medicine residency at Cedars-Sinai Medical Center and has worked as an associate with the Global Bioaccess venture fund.',
    linkedin: 'https://www.linkedin.com/in/cyrkevin/',
  },
];

function Founders() {
  return (
    <section
      id="team"
      style={{
        scrollMarginTop: 80,
        background: 'var(--surface)',
        borderTop: '1px solid var(--hairline)',
        borderBottom: '1px solid var(--hairline)',
        padding: '96px 0',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <h2
          style={{
            margin: '0 0 48px',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 34,
            lineHeight: '39px',
            letterSpacing: '-0.6px',
          }}
        >
          Meet the founders.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'start' }}>
          {FOUNDERS.map((founder) => (
            <div key={founder.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cor-founder__photo" src={founder.photo} alt={founder.name} />
              <h3 className="cor-founder__name">{founder.name}</h3>
              <p className="cor-founder__bio">{founder.bio}</p>
              <a className="cor-founder__link" href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
                <ArrowIcon />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistFooter() {
  return (
    <footer id="footer" style={{ scrollMarginTop: 80, borderTop: '1px solid var(--hairline)', padding: '64px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 40px', fontSize: 17, lineHeight: '24px' }}>
          <Link href="/contact" className="cor-h6" style={{ display: 'flex', alignItems: 'center', minHeight: 44, color: 'var(--slate)', textDecoration: 'none' }}>
            Contact
          </Link>
          <a
            href="https://www.linkedin.com/company/coralumhealth/"
            target="_blank"
            rel="noopener noreferrer"
            className="cor-h7"
            style={{ display: 'flex', alignItems: 'center', minHeight: 44, color: 'var(--slate)', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
          <Link
            href="/privacy"
            className="cor-h7"
            style={{ display: 'flex', alignItems: 'center', minHeight: 44, color: 'var(--slate)', textDecoration: 'none' }}
          >
            Privacy policy
          </Link>
        </div>
        <div
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid var(--hairline)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 32px',
            fontSize: 16,
            lineHeight: '24px',
            color: 'var(--slate)',
          }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            HIPAA covered entity · Coralum, 2026
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function WaitlistLanding() {
  return (
    <WaitlistLandingInteractions>
      <a className="cor-skip" href="#top">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <StatsBand />
        <Symptoms />
        <HowItWorks />
        <Pillars />
        <Coverage />
        <ClosingWaitlist />
        <Questions />
        <Founders />
      </main>
      <WaitlistFooter />
      <ScrollDepthTracker />
    </WaitlistLandingInteractions>
  );
}
