import Link from 'next/link';
import SignupForm from './signup-form';

export const metadata = {
  title: 'Sign Up | Coralum Care',
  description: 'Create your Coralum Care account to get started with your personalized health dashboard.',
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf8_0%,#eefbf3_100%)] px-6 py-16 text-slate-900">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_25px_100px_rgba(15,23,42,0.08)]">
        <div className="p-8 sm:p-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Coralum Care
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create Account
              </h1>
              <p className="text-slate-600">
                Sign up to get started with your personalized care plan.
              </p>
            </div>

            <SignupForm />

            <div className="text-center text-sm text-slate-600">
              <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
