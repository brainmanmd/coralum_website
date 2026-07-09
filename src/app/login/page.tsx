import { Suspense } from 'react';
import LoginForm from '@/components/auth/login-form';

export const metadata = {
  title: 'Clinician Sign In | Coralum',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F5F1] px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
