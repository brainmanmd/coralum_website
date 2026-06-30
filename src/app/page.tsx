import Nav from '@/components/marketing/nav';
import Hero from '@/components/marketing/hero';
import ProblemReframe from '@/components/marketing/problem-reframe';
import HowItWorks from '@/components/marketing/how-it-works';
import WhatYouGet from '@/components/marketing/what-you-get';
import ForCaregivers from '@/components/marketing/for-caregivers';
import ForCareTeams from '@/components/marketing/for-care-teams';
import TrustBar from '@/components/marketing/trust-bar';
import Footer from '@/components/marketing/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemReframe />
        <HowItWorks />
        <WhatYouGet />
        <ForCaregivers />
        <ForCareTeams />
        <TrustBar />
      </main>
      <Footer />
    </>
  );
}
