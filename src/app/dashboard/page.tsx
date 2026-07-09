import PatientReviewDashboard from "@/components/dashboard/patient-review-dashboard";

export const metadata = {
  title: "Patient Review | Coralum",
  description: "Clinician dashboard for reviewing wearable-informed medication recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <PatientReviewDashboard />;
}
