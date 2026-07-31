/**
 * Content source for Coralum's SEO landing pages.
 *
 * Each entry renders a full page at /<slug> via src/app/[slug]/page.tsx and is
 * automatically included in sitemap.xml. To add a page, add an entry here — no
 * new route or component work required.
 *
 * Editorial rules for these pages:
 *  - Educational and supportive. Never promise clinical outcomes.
 *  - `answer` is a tight, quotable definition (used for AI/search snippets).
 *  - Keep `title` under ~60 chars of visible text and `description` under ~155.
 *  - Health copy must be reviewed by a clinician before publishing changes.
 */

export type LandingSection = {
  heading: string;
  body: string[];
};

export type LandingPage = {
  slug: string;
  /** <title> — keyword first, brand suffixed. */
  title: string;
  /** <meta name="description"> */
  description: string;
  /** Small uppercase label above the H1. */
  eyebrow: string;
  /** On-page H1 — human and warm; the keyword lives in the title/subhead. */
  h1: string;
  /** Serif italic line under the H1. Should contain the keyword naturally. */
  subhead: string;
  /**
   * A 2–3 sentence plain-language answer to the page's core question.
   * Rendered in a callout — the block search engines and AI assistants quote.
   */
  answer: string;
  sections: LandingSection[];
  /** Short scannable takeaways. */
  keyPoints: string[];
  /** Slugs of related landing pages, for internal linking. */
  related: string[];
};

export const landingPages: LandingPage[] = [
  {
    slug: 'parkinsons-telehealth',
    title: "Telehealth for Parkinson's Disease | Coralum",
    description:
      "How telehealth works for Parkinson's disease — what virtual visits can and can't do, who it suits, and how remote symptom tracking supports your neurology care.",
    eyebrow: 'Telehealth',
    h1: 'Expert Parkinson’s care, without the drive',
    subhead:
      'How telehealth for Parkinson’s disease works — and where it fits alongside your in-person care.',
    answer:
      "Telehealth for Parkinson's disease means connecting with your care team remotely — by video, phone, or messaging — instead of travelling to a clinic for every interaction. It works well for reviewing symptoms, adjusting medication timing, answering questions, and checking in between appointments. It complements in-person neurology care rather than replacing it.",
    sections: [
      {
        heading: 'Why travel is its own symptom burden',
        body: [
          'For many people with Parkinson’s, the hardest part of an appointment is getting to it. Movement symptoms, fatigue, and the logistics of transport can turn a 20-minute consultation into an exhausting day — often with a family member taking time off work to help.',
          'Specialist access adds another layer. Movement disorder specialists are concentrated in larger cities and academic centres, so many people either travel long distances or see a clinician without Parkinson’s-specific training. Telehealth narrows that gap by making the specialist relationship less dependent on geography.',
        ],
      },
      {
        heading: 'What virtual Parkinson’s care handles well',
        body: [
          'A great deal of Parkinson’s care is conversation and pattern recognition rather than hands-on examination. Reviewing how symptoms have changed, talking through medication timing and side effects, discussing sleep, mood, or fatigue, and coordinating with physical or speech therapy all translate well to a remote visit.',
          'Remote care also tends to produce a more realistic picture. A clinic visit is a snapshot on one day, at one time, often when medication is working at its best. Seeing someone in their own home — and reviewing symptom patterns recorded over weeks — reflects everyday life more accurately than a single appointment can.',
        ],
      },
      {
        heading: 'What still needs an in-person visit',
        body: [
          'Telehealth is not a full substitute. Parts of the neurological examination need hands-on assessment, and procedures such as deep brain stimulation programming, injections, and some diagnostic testing require an in-person appointment. Sudden or severe changes — a fall with injury, a rapid decline, confusion, or signs of infection — need urgent in-person care.',
          'The practical model most people land on is a blend: periodic in-person visits with your neurologist for examination and bigger decisions, supported by remote check-ins and continuous tracking in between.',
        ],
      },
      {
        heading: 'Where Coralum fits',
        body: [
          'Coralum is built around the space between appointments. It helps you record symptoms, medication timing, sleep, and daily changes in a structured way, so patterns become visible instead of being reconstructed from memory in a 20-minute visit.',
          'That record does two things: it helps you notice what is actually changing, and it gives your care team specific information to work from. Coralum is designed to support the relationship with your existing neurologist and care team, not to replace it.',
        ],
      },
    ],
    keyPoints: [
      'Telehealth suits symptom review, medication timing discussions, and between-visit check-ins.',
      'Hands-on examination, DBS programming, and urgent problems still need in-person care.',
      'A blended model — in-person visits plus remote tracking — is what most people use.',
      'Remote records reflect everyday life better than a single clinic snapshot.',
    ],
    related: ['care-between-visits', 'parkinsons-off-episodes'],
  },

  {
    slug: 'care-between-visits',
    title: "Parkinson's Care Between Neurology Visits | Coralum",
    description:
      "Neurology visits are often months apart. Learn what changes in between, why it matters, and how tracking symptoms between appointments improves Parkinson's care.",
    eyebrow: 'Between visits',
    h1: 'The months between appointments, handled',
    subhead:
      'Why Parkinson’s care between neurology visits matters more than the visits themselves.',
    answer:
      "Most people with Parkinson's see their neurologist every three to six months, so the majority of living with the condition happens between appointments. Symptoms, medication response, and sleep can shift meaningfully in that time. Tracking those changes as they happen gives your care team accurate information instead of a recollection, which makes appointments more useful.",
    sections: [
      {
        heading: 'The gap is where the condition actually happens',
        body: [
          'Parkinson’s follow-up is typically scheduled every three to six months. That means the overwhelming majority of the experience — good days, difficult days, medication that works and medication that stops working early — happens with no clinician watching.',
          'Parkinson’s is also progressive and highly variable. Symptoms fluctuate through the day and change over months. A schedule built around occasional appointments is a poor match for a condition that changes continuously.',
        ],
      },
      {
        heading: 'Why recall makes appointments harder',
        body: [
          'Appointments often open with a version of “how have you been doing since last time?” — a question that asks you to summarise several months of fluctuating symptoms from memory, usually in a few minutes.',
          'Recall is genuinely difficult here. Recent days dominate, unusually bad days stand out, and gradual change is the easiest kind to miss precisely because it is gradual. Details that matter clinically — when a dose stops working, how long a difficult period lasts, whether sleep changed before or after a medication adjustment — are exactly the details hardest to reconstruct.',
        ],
      },
      {
        heading: 'What a good between-visit record contains',
        body: [
          'Useful tracking is specific and light enough to actually sustain. In practice that means medication timing and how long each dose seems to help, when symptoms are at their best and worst through the day, sleep quality, falls or near-falls, and any new or changing non-motor symptoms such as mood, fatigue, or constipation.',
          'The goal is not to document everything. It is to capture enough of the pattern that you and your clinician can see a trend rather than debate an impression.',
        ],
      },
      {
        heading: 'Turning a record into better care',
        body: [
          'When a clinician can see that afternoon doses have been fading earlier for six weeks, the conversation moves from “things feel worse” to a specific adjustment. Concrete patterns support concrete decisions about timing, dose, or referral.',
          'Coralum is designed for exactly this: lightweight tracking that fits into a normal day, organised so it is genuinely useful at your next appointment — and so meaningful changes are less likely to wait months to be noticed.',
        ],
      },
    ],
    keyPoints: [
      'Neurology follow-up is usually every 3–6 months; most of the condition happens in between.',
      'Memory reliably under-reports gradual change — the change that matters most.',
      'Track medication timing, daily best/worst periods, sleep, falls, and non-motor symptoms.',
      'Specific patterns let clinicians make specific adjustments.',
    ],
    related: ['parkinsons-off-episodes', 'parkinsons-telehealth'],
  },

  {
    slug: 'parkinsons-off-episodes',
    title: "Parkinson's 'Off' Episodes and Wearing Off | Coralum",
    description:
      "What Parkinson's 'off' episodes and medication wearing off feel like, why they happen, what to track, and how to describe them accurately to your neurologist.",
    eyebrow: 'Symptoms',
    h1: 'When your medication stops working early',
    subhead:
      'Understanding Parkinson’s “off” episodes and medication wearing off — and what to track.',
    answer:
      "An “off” episode in Parkinson's is a period when medication is not controlling symptoms well and tremor, stiffness, or slowness return. “Wearing off” describes the benefit of a dose fading before the next one is due. Both are common as Parkinson's progresses, and both are usually manageable — but only if the timing is described accurately to your care team.",
    sections: [
      {
        heading: '“On”, “off”, and why it changes over time',
        body: [
          'Clinicians describe Parkinson’s symptom control in terms of “on” time, when medication is working and movement is easier, and “off” time, when its effect has faded and symptoms return. Early on, medication benefit often feels smooth and continuous. Over the years, many people begin to feel the difference between doses more sharply.',
          'This shift is a recognised part of the condition’s course rather than a sign of doing something wrong, and it is one of the most common reasons treatment plans are adjusted.',
        ],
      },
      {
        heading: 'What wearing off can feel like',
        body: [
          'Wearing off is not only tremor. Slowness, stiffness, a heavier or more dragging walk, smaller handwriting, quieter speech, and difficulty rising from a chair are all common. Many people also notice non-motor changes — anxiety, low mood, fatigue, sweating, or a sense of unease — that can appear before the movement symptoms do.',
          'Because those non-motor signals are easy to attribute to something else, they are frequently left out of the conversation. They are often the most reliable early warning that a dose is fading.',
        ],
      },
      {
        heading: 'What to track — and why timing is everything',
        body: [
          'The clinically valuable information is timing. When was each dose taken? How long until it helped? How long did the benefit last? What returned first as it faded? Recording that pattern over one or two weeks tends to be more useful than a general statement that things have worsened.',
          'A simple note of dose times alongside your best and worst periods each day is usually enough. Patterns emerge quickly — for example, that the mid-afternoon dose has consistently been fading about an hour early.',
        ],
      },
      {
        heading: 'Talking to your care team',
        body: [
          'Bring specifics: how many hours of good control you get from a typical dose, which symptom returns first, whether it has changed over recent weeks, and how much it affects daily activities. Adjustments to timing, dose, formulation, or additional medication are common responses, and there are several established approaches.',
          'Contact your care team sooner rather than waiting for a scheduled appointment if off periods are becoming longer or more frequent, if falls are occurring, if swallowing becomes difficult, or if new confusion or hallucinations appear.',
        ],
      },
    ],
    keyPoints: [
      '“Off” means symptoms returning when medication isn’t controlling them well.',
      '“Wearing off” means a dose’s benefit fading before the next is due.',
      'Non-motor changes like anxiety or fatigue often signal wearing off first.',
      'Record dose times and how long benefit lasts — timing drives treatment decisions.',
      'Report worsening off periods, falls, swallowing trouble, or confusion promptly.',
    ],
    related: ['care-between-visits', 'parkinsons-telehealth'],
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((page) => page.slug === slug);
}

export const landingSlugs = landingPages.map((page) => page.slug);
