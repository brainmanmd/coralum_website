import Link from 'next/link';
import Nav from '@/components/marketing/nav';
import Footer from '@/components/marketing/footer';

export const metadata = {
  title: 'Privacy Policy | Coralum',
  description: "Coralum's privacy policy: what we collect through the waitlist, how we use it, and your privacy rights.",
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-coralum-navy">{title}</h2>
      <div className="mt-3 space-y-4 font-body text-base leading-relaxed text-coralum-slate">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-serif text-lg text-coralum-navy">{title}</h3>
      <div className="mt-2 space-y-4 font-body text-base leading-relaxed text-coralum-slate">
        {children}
      </div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-coralum-cream">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h1 className="font-serif text-4xl text-coralum-navy">Coralum Privacy Policy</h1>
          <p className="mt-3 font-body text-sm text-coralum-slate">
            Effective Date: September 22, 2026
            <br />
            Last Updated: September 22, 2026
          </p>

          <Section title="1. Who We Are">
            <p>
              Coralum (&ldquo;Coralum,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              operates the website at coralum.ai (the &ldquo;Site&rdquo;). Coralum is developing an
              AI-enabled chronic care management platform for people living with Parkinson&apos;s.
              This Privacy Policy describes the personal information we collect through the
              Site&apos;s waitlist form and related pages, and how we use, share, and protect it.
            </p>
            <p>
              Coralum does not currently provide medical care, diagnosis, or treatment through the
              Site. Joining the waitlist does not create a doctor-patient relationship, a treatment
              relationship, or any other clinical relationship with Coralum.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <SubSection title="2.1 Information You Provide">
              <p>When you join the waitlist, we collect:</p>
              <List items={['Your name', 'Email address', 'State']} />
              <p>
                The waitlist form does not ask about your or anyone else&apos;s health, diagnosis,
                or relationship to Parkinson&apos;s, and we do not knowingly collect that
                information at this stage.
              </p>
            </SubSection>
            <SubSection title="2.2 Information Collected Automatically">
              <p>
                When you visit the Site, we and our service providers may automatically collect:
              </p>
              <List
                items={[
                  'IP address and approximate location',
                  'Browser type, device type, and operating system',
                  'Pages viewed, referring URL, and time spent on the Site',
                  'Cookies and similar tracking technologies — described further in Section 5',
                ]}
              />
            </SubSection>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <List
              items={[
                'Maintain and manage the waitlist',
                "Send updates about Coralum's launch, pilot program, and related news",
                'Understand and improve interest in the Site and our planned product',
                'Respond to questions you send us',
                'Comply with legal obligations',
              ]}
            />
          </Section>

          <Section title="4. How We Share Your Information">
            <p>We share information with:</p>
            <List
              items={[
                'Google Cloud, which hosts our website and stores the waitlist database',
                'Google Analytics, for website usage analytics',
                'Third-party advertising partners, such as Meta, Google, ChatGPT, or similar platforms if and when we run paid ad campaigns, to measure and optimize those campaigns',
                'Professional advisors, such as lawyers and accountants, as needed',
                'Government authorities or other third parties if required by law',
              ]}
            />
            <p>We do not sell your personal information.</p>
          </Section>

          <Section title="5. Cookies, Analytics, and Advertising">
            <SubSection title="Cookies">
              <p>
                We and our service providers use cookies and similar technologies to operate the
                Site and to understand how it&apos;s used. You can control cookies through your
                browser settings; blocking them may affect some features of the Site.
              </p>
            </SubSection>
            <SubSection title="Analytics">
              <p>
                We use Google Analytics to understand website usage — for example, which pages are
                visited and how people arrive at the Site. You can opt out of Google Analytics
                specifically using Google&apos;s own Analytics Opt-out Browser Add-on.
              </p>
            </SubSection>
            <SubSection title="Advertising">
              <p>
                If and when we run paid ad campaigns, our advertising partners (such as Meta,
                Google, ChatGPT, or other) may use cookies, pixels, or similar technologies to
                inform, optimize, and measure those campaigns, including reporting how ad
                impressions relate to visits to the Site. We do not sell personal information in
                the traditional sense; however, disclosing information such as identifiers (for
                example, a hashed email address) or online activity to these partners for that
                purpose may be considered a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
                information under some state privacy laws. See Section 6 for how to opt out.
              </p>
            </SubSection>
            <SubSection title="Do Not Track and Global Privacy Control">
              <p>
                We do not respond to browser &ldquo;Do Not Track&rdquo; signals, since there is no
                industry-wide standard for how to interpret them. Where required by law, we treat
                our initial receipt of a Global Privacy Control (GPC) signal as a valid request to
                opt out of the sale or sharing of personal information, described in Section 6. If
                you are logged out or do not have an account, our processing of the signal is
                limited to the browser you are using at the time.
              </p>
            </SubSection>
          </Section>

          <Section title="6. Your Privacy Rights">
            <p>Depending on where you live, you may have the right to:</p>
            <List
              items={[
                'Confirm whether we are processing your personal information',
                'Access a copy of the personal information we hold about you',
                'Correct inaccurate information',
                'Delete your personal information',
                'Opt out of the sale or sharing of your personal information, or its use for targeted advertising',
                'Opt out of marketing emails at any time, using the unsubscribe link in our emails or by contacting us directly — you may still receive administrative messages about your waitlist status',
              ]}
            />
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:hello@coralum.ai" className="text-coralum-blue underline">
                hello@coralum.ai
              </a>
              . We will not discriminate against you for exercising these rights.
            </p>
            <SubSection title="Opting Out of Sale/Sharing for Targeted Advertising">
              <p>
                As described in Section 5, if we share information with advertising partners to
                measure or optimize ad campaigns, that may be considered a &ldquo;sale&rdquo; or
                &ldquo;sharing&rdquo; of personal information under some state laws. To opt out,
                contact us at{' '}
                <a href="mailto:hello@coralum.ai" className="text-coralum-blue underline">
                  hello@coralum.ai
                </a>
                , or use the Global Privacy Control signal in your browser, which we honor where
                required by law.
              </p>
            </SubSection>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We keep waitlist information for up to 24 months after your last contact with us, or
              until you ask us to delete it sooner, whichever comes first.
            </p>
          </Section>

          <Section title="8. Data Security">
            <p>
              We use reasonable administrative, technical, and physical safeguards designed to
              protect your information. No method of transmission or storage is completely secure,
              and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              The Site is not directed to children under 18, and we do not knowingly collect
              personal information from children.
            </p>
          </Section>

          <Section title="10. International Visitors">
            <p>
              The Site is intended for visitors in the United States. Coralum does not target or
              knowingly offer the waitlist to individuals outside the U.S.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version
              on this page and update the &ldquo;Last Updated&rdquo; date above. If changes are
              material, we will provide additional notice as required by law.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>Questions about this Privacy Policy or your personal information can be directed to:</p>
            <p>
              Coralum Health
              <br />
              <a href="mailto:hello@coralum.ai" className="text-coralum-blue underline">
                hello@coralum.ai
              </a>
            </p>
          </Section>

          <p className="mt-12 font-body text-sm text-coralum-slate">
            <Link href="/" className="text-coralum-blue underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
