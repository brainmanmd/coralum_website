/**
 * Content source for Coralum's paid-ad landing pages.
 *
 * Each entry renders a full, conversion-focused page at /lp/<slug> via
 * src/app/lp/[slug]/page.tsx. These are separate from the SEO landing pages
 * in src/lib/landing/pages.ts — ad pages are short, single-CTA, and meant to
 * be linked directly from ad creative for A/B testing signup rates.
 *
 * To add a variant, add an entry here — no new route or component work
 * required.
 */

import type { AdStep } from '@/components/marketing/ad-how-it-works';

export type AdLandingPage = {
  slug: string;
  /** <title> — used for the tab title only; ad pages are not meant to rank organically. */
  title: string;
  description: string;
  /** Plain-colored portion of the H1. */
  headingPlain: string;
  /** Blue-highlighted portion of the H1, rendered right after headingPlain. */
  headingHighlight: string;
  /** Italic line under the H1. */
  subhead: string;
  /** Path under /public for the "How it works" section image. */
  heroImage: string;
  heroImageAlt: string;
  steps: AdStep[];
};

const defaultSteps = (
  step2: { title: string; description: string },
  step3: { title: string; description: string }
): AdStep[] => [
  {
    number: '1',
    color: 'text-coralum-blue',
    title: 'Connect with our clinicians',
    description: 'Sign up and schedule a short onboarding call',
  },
  {
    number: '2',
    color: 'text-coralum-sage',
    ...step2,
  },
  {
    number: '3',
    color: 'text-coralum-peach',
    ...step3,
  },
  {
    number: '4',
    color: 'text-coralum-slate',
    title: 'Keep your doctor in the loop',
    description: 'Coralum keeps your existing provider updated',
  },
];

export const adLandingPages: AdLandingPage[] = [
  {
    slug: 'symptoms-changing',
    title: "Your Symptoms Are Changing Every Hour | Coralum",
    description:
      "Our care team is there for you, anytime, anywhere. Join the Coralum waitlist for specialized Parkinson's care between visits.",
    headingPlain: 'Your symptoms are changing every hour,',
    headingHighlight: 'but your doctor only sees you for 20 mins.',
    subhead: 'Our care team is there for you, anytime, anywhere',
    heroImage: '/images/ads/hero-1.png',
    heroImageAlt: 'A patient having a televisit with a doctor from home',
    steps: defaultSteps(
      {
        title: 'Get regular check-ins',
        description: "Proactive outreach to see how you're doing",
      },
      {
        title: 'Build your own plan',
        description: 'Care targeting your most important symptoms',
      }
    ),
  },
  {
    slug: 'symptoms-dont-wait',
    title: "Symptoms Don't Wait for the Next Appointment | Coralum",
    description:
      "Our care team is there for you, anytime, anywhere. Join the Coralum waitlist for specialized Parkinson's care between visits.",
    headingPlain: "Symptoms don't wait for the next appointment —",
    headingHighlight: 'Neither do we.',
    subhead: 'Our care team is there for you, anytime, anywhere',
    heroImage: '/images/ads/hero-2.png',
    heroImageAlt: 'A patient and their care partner reviewing a televisit together',
    steps: defaultSteps(
      {
        title: 'Get regular check-ins',
        description: 'Proactive outreach from our clinical team',
      },
      {
        title: 'Design a personalized care plan',
        description: 'Care targeting the most important symptoms',
      }
    ),
  },
  {
    slug: 'dont-slow-down',
    title: "Parkinson's Doesn't Have to Slow You Down | Coralum",
    description:
      'Our care team keeps you moving. Join the Coralum waitlist for specialized Parkinson\'s care between visits.',
    headingPlain: "Parkinson's doesn't have to",
    headingHighlight: 'slow you down.',
    subhead: 'Our care team keeps you moving.',
    heroImage: '/images/ads/hero-3.png',
    heroImageAlt: 'A couple walking together outdoors',
    steps: defaultSteps(
      {
        title: 'Catch changes early',
        description: 'Small shifts get noticed before they turn into setbacks',
      },
      {
        title: 'Build your own plan',
        description: 'Care targeting your most important symptoms',
      }
    ),
  },
  {
    slug: 'dont-put-life-on-hold',
    title: "Don't Let Parkinson's Put Your Life on Hold | Coralum",
    description:
      'Our care team keeps you moving. Join the Coralum waitlist for specialized Parkinson\'s care between visits.',
    headingPlain: "Don't let Parkinson's",
    headingHighlight: 'put your life on hold.',
    subhead: 'Our care team keeps you moving.',
    heroImage: '/images/ads/hero-4.png',
    heroImageAlt: 'A person enjoying time outdoors by the water',
    steps: defaultSteps(
      {
        title: 'Catch changes early',
        description: 'Small shifts get noticed before they turn into setbacks',
      },
      {
        title: 'Design a personalized care plan',
        description: 'Care targeting the most important symptoms',
      }
    ),
  },
];

export function getAdLandingPage(slug: string): AdLandingPage | undefined {
  return adLandingPages.find((page) => page.slug === slug);
}

export const adLandingSlugs = adLandingPages.map((page) => page.slug);
