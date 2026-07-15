import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PatientReviewDashboard from "@/components/dashboard/patient-review-dashboard";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { getReviewQueue, getClinicianById } from "@/lib/dashboard/queries";

export const metadata = {
  title: "Patient Review | Coralum",
  description: "Clinician dashboard for reviewing wearable-informed medication recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  // proxy.ts already gates this route, but a server component should never
  // trust proxy alone (see the Data Security note in the Next.js proxy docs).
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const [queue, clinician] = await Promise.all([
    getReviewQueue(),
    getClinicianById(session.clinicianId),
  ]);

  return <PatientReviewDashboard initialQueue={queue} clinician={clinician} />;
}
