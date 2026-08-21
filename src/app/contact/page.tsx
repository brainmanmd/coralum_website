import Nav from '@/components/marketing/nav';
import Footer from '@/components/marketing/footer';

export const metadata = {
  title: 'Contact | Coralum',
  description: "Get in touch with the Coralum team.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="bg-coralum-cream">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-serif text-4xl text-coralum-navy">Get in touch</h1>
          <p className="mt-4 font-body text-base leading-relaxed text-coralum-slate">
            We&apos;re always glad to hear from you — whether it&apos;s a question
            about Coralum, a partnership idea, or a Parkinson&apos;s story
            you&apos;d like to share.
          </p>
          <a
            href="mailto:hello@coralum.ai"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-coralum-navy px-7 py-3.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
          >
            hello@coralum.ai
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
