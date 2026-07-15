export type ReasonIconKind = "phone" | "clock" | "activity";

export type Urgency = "Routine" | "Priority review" | "Urgent";

export type Confidence = "High confidence" | "Moderate confidence" | "Low confidence";

export interface Reason {
  chip: string;
  icon: ReasonIconKind;
  text: string;
}

export interface TranscriptMessage {
  name: string;
  time: string;
  patient: boolean;
  text: string;
}

export interface PatientRecord {
  initials: string;
  name: string;
  meta: string;
  diag: string;
  diagSub: string;
  problems: string[];
  lastVisit: string;
  wearable: string;
  drug: string;
  drugSub: string;
  current: { dose: string; freq: string; ld: number; times: number };
  rec: { cd: string; ld: string; freq: string };
  urgency: Urgency;
  confidence: Confidence;
  drawerLabel: string;
  reasons: Reason[];
  transcriptHighlights: string[];
  transcriptDate: string;
  transcript: TranscriptMessage[];
}

export const patients: PatientRecord[] = [
  {
    initials: "JR",
    name: "Jordan A. Rivera",
    meta: "MRN 000-DEMO-4821 · 67 yr · Male · DOB 1958-11-03",
    diag: "Parkinson's disease",
    diagSub: "Idiopathic",
    problems: ["Hypertension", "Hyperlipidemia"],
    lastVisit: "Jun 12, 2026",
    wearable: "Wearable active",
    drug: "Rytary",
    drugSub: "extended-release carbidopa and levodopa",
    current: { dose: "48.75/195", freq: "three times daily", ld: 195, times: 3 },
    rec: { cd: "23.75", ld: "95", freq: "three times daily" },
    urgency: "Priority review",
    confidence: "High confidence",
    drawerLabel: "Episode of Dyskinesia",
    reasons: [
      {
        chip: "#FAEEE0",
        icon: "phone",
        text: "Patient reported non-motor issues such difficulty with falling asleep and worsening anxiety between doses",
      },
      {
        chip: "#E3EFFA",
        icon: "activity",
        text: "Periodic dyskinesia noted on tremor analysis from wearable sensor",
      },
    ],
    transcriptHighlights: [
      "Between-dose anxiety and restlessness, worsening over the last two weeks",
      "Difficulty falling asleep, lying awake for hours most nights",
      "Symptoms flagged for review alongside wearable sensor data",
    ],
    transcriptDate: "Jun 8, 2026",
    transcript: [
      {
        name: "Coralum Care",
        time: "Mon 9:12 AM",
        patient: false,
        text: "Hi Jordan — checking in ahead of your review. How have you been feeling between doses this week?",
      },
      {
        name: "Jordan Rivera",
        time: "Mon 9:31 AM",
        patient: true,
        text: "Honestly, not great. By late afternoon, before my next dose, I get really anxious and restless.",
      },
      {
        name: "Coralum Care",
        time: "Mon 9:34 AM",
        patient: false,
        text: "Thanks for sharing that. Is the anxiety new, or has it changed recently?",
      },
      {
        name: "Jordan Rivera",
        time: "Mon 9:40 AM",
        patient: true,
        text: "It's gotten worse over the last couple of weeks. And I'm having a hard time falling asleep at night too — I just lie there for hours.",
      },
      {
        name: "Coralum Care",
        time: "Mon 9:42 AM",
        patient: false,
        text: "Got it. I'll flag the between-dose anxiety and the trouble sleeping for Dr. Voss to review alongside your wearable data.",
      },
      {
        name: "Jordan Rivera",
        time: "Mon 9:45 AM",
        patient: true,
        text: "Thank you, I really appreciate that.",
      },
    ],
  },
  {
    initials: "ME",
    name: "Marcus D. Elling",
    meta: "MRN 000-DEMO-7734 · 72 yr · Male · DOB 1953-04-21",
    diag: "Parkinson's disease",
    diagSub: "Idiopathic",
    problems: ["Hypertension", "Osteoarthritis"],
    lastVisit: "Jun 28, 2026",
    wearable: "Wearable active",
    drug: "Sinemet ER",
    drugSub: "sustained-release carbidopa and levodopa",
    current: { dose: "50/200", freq: "three times daily", ld: 200, times: 3 },
    rec: { cd: "50", ld: "200", freq: "four times daily" },
    urgency: "Priority review",
    confidence: "Moderate confidence",
    drawerLabel: "Wearing-off episode",
    reasons: [
      {
        chip: "#E3EFFA",
        icon: "activity",
        text: 'Wearable data shows increased "off" episodes in the hours before each scheduled dose',
      },
      {
        chip: "#FAEEE0",
        icon: "phone",
        text: "Patient reported motor symptoms returning about an hour before the next dose is due",
      },
    ],
    transcriptHighlights: [
      "Stiffness and slowness return roughly an hour before the next scheduled dose",
      "Wearing-off now occurs before nearly every dose, most notably in the afternoon",
      "Patient reports effect duration has shortened compared to prior weeks",
    ],
    transcriptDate: "Jun 26, 2026",
    transcript: [
      {
        name: "Coralum Care",
        time: "Tue 2:04 PM",
        patient: false,
        text: "Hi Marcus — reviewing your data before your appointment. How are things feeling between your doses?",
      },
      {
        name: "Marcus Elling",
        time: "Tue 2:20 PM",
        patient: true,
        text: "Pretty good right after I take it, but about an hour before the next one my stiffness and slowness come back.",
      },
      {
        name: "Coralum Care",
        time: "Tue 2:23 PM",
        patient: false,
        text: "Thanks — does that happen before every dose, or just some of them?",
      },
      {
        name: "Marcus Elling",
        time: "Tue 2:31 PM",
        patient: true,
        text: "Pretty much every dose now, especially in the afternoon. It seems to wear off sooner than it used to.",
      },
      {
        name: "Coralum Care",
        time: "Tue 2:33 PM",
        patient: false,
        text: "Understood. I'll note the early wearing-off before doses for Dr. Voss to review with your movement data.",
      },
    ],
  },
];

export const freqToTimesPerDay: Record<string, number> = {
  "once daily": 1,
  "twice daily": 2,
  "three times daily": 3,
  "four times daily": 4,
};
