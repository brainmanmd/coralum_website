import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import {
  patients,
  medicationRecommendations,
  recommendationReasons,
  transcriptMessages,
  transcriptHighlights,
  clinicians,
} from '@/lib/db/schema';
import type { ReasonIconKind, Urgency, Confidence } from './patient-review-data';

export interface QueuePatient {
  recommendationId: number;
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
  reasons: { chip: string; icon: ReasonIconKind; text: string }[];
  transcriptHighlights: string[];
  transcriptDate: string;
  transcript: { name: string; time: string; patient: boolean; text: string }[];
  pharmacyName: string | null;
  pharmacyAddress: string | null;
}

export interface CurrentClinician {
  id: number;
  fullName: string;
  specialty: string | null;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(value: string | Date | null): string {
  if (!value) return '';
  // A bare 'YYYY-MM-DD' string (from a `date` column) is parsed by `Date` as
  // UTC midnight, which then renders as the *previous* day in any timezone
  // behind UTC. Appending a local time-of-day avoids that shift.
  const d = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMessageTime(sentAt: Date): string {
  const weekday = sentAt.toLocaleDateString('en-US', { weekday: 'short' });
  const time = sentAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${weekday} ${time}`;
}

export async function getReviewQueue(): Promise<QueuePatient[]> {
  const rows = await db
    .select({ patient: patients, recommendation: medicationRecommendations })
    .from(medicationRecommendations)
    .innerJoin(patients, eq(medicationRecommendations.patientId, patients.id))
    .where(eq(medicationRecommendations.status, 'pending'))
    .orderBy(asc(medicationRecommendations.createdAt));

  const queue: QueuePatient[] = [];

  for (const row of rows) {
    const [reasons, highlights, messages] = await Promise.all([
      db
        .select()
        .from(recommendationReasons)
        .where(eq(recommendationReasons.recommendationId, row.recommendation.id))
        .orderBy(asc(recommendationReasons.sortOrder)),
      db
        .select()
        .from(transcriptHighlights)
        .where(eq(transcriptHighlights.patientId, row.patient.id))
        .orderBy(asc(transcriptHighlights.sortOrder)),
      db
        .select()
        .from(transcriptMessages)
        .where(eq(transcriptMessages.patientId, row.patient.id))
        .orderBy(asc(transcriptMessages.sortOrder)),
    ]);

    const lastMessage = messages[messages.length - 1];

    queue.push({
      recommendationId: row.recommendation.id,
      initials: initialsFromName(row.patient.fullName),
      name: row.patient.fullName,
      meta: `MRN ${row.patient.mrn} · ${calcAge(row.patient.dateOfBirth)} yr · ${row.patient.sex} · DOB ${row.patient.dateOfBirth}`,
      diag: row.patient.diagnosis,
      diagSub: row.patient.diagnosisSub ?? '',
      problems: row.patient.problems,
      lastVisit: formatDate(row.patient.lastVisitDate),
      wearable: row.patient.wearableStatus ?? '',
      drug: row.recommendation.drugName,
      drugSub: row.recommendation.drugSub ?? '',
      current: {
        dose: row.recommendation.currentDoseLabel,
        freq: row.recommendation.currentFreq,
        ld: row.recommendation.currentLevodopaMg,
        times: row.recommendation.currentTimesPerDay,
      },
      rec: {
        cd: row.recommendation.recommendedCarbidopaMg,
        ld: row.recommendation.recommendedLevodopaMg,
        freq: row.recommendation.recommendedFreq,
      },
      urgency: row.recommendation.urgency as Urgency,
      confidence: row.recommendation.confidence as Confidence,
      drawerLabel: row.recommendation.drawerLabel ?? '',
      reasons: reasons.map((r) => ({ chip: r.chipColor, icon: r.icon as ReasonIconKind, text: r.body })),
      transcriptHighlights: highlights.map((h) => h.body),
      transcriptDate: lastMessage ? formatDate(lastMessage.sentAt) : '',
      transcript: messages.map((m) => ({
        name: m.senderName,
        time: formatMessageTime(m.sentAt),
        patient: m.isPatient,
        text: m.body,
      })),
      pharmacyName: row.patient.pharmacyName,
      pharmacyAddress: row.patient.pharmacyAddress,
    });
  }

  return queue;
}

export async function getClinicianById(id: number): Promise<CurrentClinician | null> {
  const rows = await db.select().from(clinicians).where(eq(clinicians.id, id)).limit(1);
  const clinician = rows[0];
  if (!clinician) return null;
  return { id: clinician.id, fullName: clinician.fullName, specialty: clinician.specialty };
}
