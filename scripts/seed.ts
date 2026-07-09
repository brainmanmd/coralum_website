// Loads .env.local the same way vitest.integration.config.ts does — `tsx
// scripts/seed.ts` does NOT pick up .env.local on its own.
import { loadEnv } from 'vite';
Object.assign(process.env, loadEnv('development', process.cwd(), ''));

import { eq, inArray } from 'drizzle-orm';
import { db } from '../src/lib/db/client';
import {
  clinicians,
  patients,
  medicationRecommendations,
  recommendationReasons,
  transcriptMessages,
  transcriptHighlights,
} from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth/password';
import { patients as mockPatients } from '../src/lib/dashboard/patient-review-data';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add it to .env.local before running \`npm run db:seed\`.`);
  }
  return value;
}

function parseMrn(meta: string): string {
  return /MRN ([\w-]+)/.exec(meta)?.[1] ?? 'UNKNOWN';
}

function parseDob(meta: string): string {
  return /DOB ([\d-]+)/.exec(meta)?.[1] ?? '1960-01-01';
}

function parseSex(meta: string): string {
  if (meta.includes('Male')) return 'Male';
  if (meta.includes('Female')) return 'Female';
  return 'Unknown';
}

// `toISOString().slice(0, 10)` would convert through UTC and can shift the
// calendar date by one depending on the machine's timezone offset.
function toLocalIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTranscriptTimestamp(dateLabel: string, timeLabel: string): Date {
  const base = new Date(dateLabel);
  const match = /(\d+):(\d+)\s*(AM|PM)/i.exec(timeLabel);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const isPm = match[3].toUpperCase() === 'PM';
    if (isPm && hour < 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;
    base.setHours(hour, minute, 0, 0);
  }
  return base;
}

async function main() {
  const email = requireEnv('SEED_CLINICIAN_EMAIL').toLowerCase().trim();
  const password = requireEnv('SEED_CLINICIAN_PASSWORD');
  const fullName = process.env.SEED_CLINICIAN_NAME ?? 'Dr. Elena Voss';
  const specialty = process.env.SEED_CLINICIAN_SPECIALTY ?? 'Neurology';

  const passwordHash = await hashPassword(password);

  const [clinician] = await db
    .insert(clinicians)
    .values({ email, passwordHash, fullName, specialty })
    .onConflictDoUpdate({ target: clinicians.email, set: { passwordHash, fullName, specialty } })
    .returning();
  console.log(`Seeded clinician ${clinician.email} (id ${clinician.id})`);

  for (const p of mockPatients) {
    const [patientRow] = await db
      .insert(patients)
      .values({
        mrn: parseMrn(p.meta),
        fullName: p.name,
        dateOfBirth: parseDob(p.meta),
        sex: parseSex(p.meta),
        diagnosis: p.diag,
        diagnosisSub: p.diagSub,
        problems: p.problems,
        lastVisitDate: toLocalIsoDate(new Date(p.lastVisit)),
        wearableStatus: p.wearable,
        pharmacyName: 'CVS Pharmacy #1016',
        pharmacyAddress: 'Palo Alto, CA',
      })
      .onConflictDoUpdate({
        target: patients.mrn,
        set: {
          fullName: p.name,
          diagnosis: p.diag,
          diagnosisSub: p.diagSub,
          problems: p.problems,
          lastVisitDate: toLocalIsoDate(new Date(p.lastVisit)),
          wearableStatus: p.wearable,
        },
      })
      .returning();

    // Re-runnable: clear this patient's existing recommendation/transcript data before reinserting.
    const existingRecs = await db
      .select({ id: medicationRecommendations.id })
      .from(medicationRecommendations)
      .where(eq(medicationRecommendations.patientId, patientRow.id));
    const existingRecIds = existingRecs.map((r) => r.id);
    if (existingRecIds.length > 0) {
      await db.delete(recommendationReasons).where(inArray(recommendationReasons.recommendationId, existingRecIds));
      await db.delete(medicationRecommendations).where(inArray(medicationRecommendations.id, existingRecIds));
    }
    await db.delete(transcriptMessages).where(eq(transcriptMessages.patientId, patientRow.id));
    await db.delete(transcriptHighlights).where(eq(transcriptHighlights.patientId, patientRow.id));

    const [recRow] = await db
      .insert(medicationRecommendations)
      .values({
        patientId: patientRow.id,
        drugName: p.drug,
        drugSub: p.drugSub,
        currentDoseLabel: p.current.dose,
        currentFreq: p.current.freq,
        currentLevodopaMg: p.current.ld,
        currentTimesPerDay: p.current.times,
        recommendedCarbidopaMg: p.rec.cd,
        recommendedLevodopaMg: p.rec.ld,
        recommendedFreq: p.rec.freq,
        urgency: p.urgency,
        confidence: p.confidence,
        drawerLabel: p.drawerLabel,
        status: 'pending',
      })
      .returning();

    for (const [i, r] of p.reasons.entries()) {
      await db.insert(recommendationReasons).values({
        recommendationId: recRow.id,
        icon: r.icon,
        chipColor: r.chip,
        body: r.text,
        sortOrder: i,
      });
    }

    for (const [i, hl] of p.transcriptHighlights.entries()) {
      await db.insert(transcriptHighlights).values({ patientId: patientRow.id, body: hl, sortOrder: i });
    }

    for (const [i, m] of p.transcript.entries()) {
      await db.insert(transcriptMessages).values({
        patientId: patientRow.id,
        senderName: m.name,
        isPatient: m.patient,
        sentAt: parseTranscriptTimestamp(p.transcriptDate, m.time),
        body: m.text,
        sortOrder: i,
      });
    }

    console.log(`Seeded patient ${patientRow.fullName} (id ${patientRow.id}) with a pending recommendation`);
  }

  console.log('Seed complete.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
