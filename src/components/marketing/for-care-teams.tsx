import Image from 'next/image';
import { LinkedInBadge } from './icons';

const team = [
  {
    photo: '/images/team/julian-salazar.jpg',
    name: 'Julian Salazar',
    bio:
      'Stanford Biodesign Innovation Fellow, Product Leader and engineer with a track record of launching digital health solutions and connected medical devices in international markets for chronic disease management, in partnership with start-ups, medtech companies and global pharma like Pfizer and Eli Lilly.',
    linkedin: 'https://www.linkedin.com/in/juliansalazarg/',
  },
  {
    photo: '/images/team/kevin-cyr.jpg',
    name: 'Kevin Cyr, MD',
    bio:
      'Dr. Kevin Cyr is a Stanford physician and innovator working at the intersection of medicine, venture capital, and digital health. He received his MD from Stanford University, completed his internal medicine residency at Cedars-Sinai Medical Center and has worked as an associate with the Global Bioaccess venture fund.',
    linkedin: 'https://www.linkedin.com/in/cyrkevin/',
  },
];

export default function ForCareTeams() {
  return (
    <section id="team" className="border-t border-coralum-navy/10 bg-[#f6f4f2] py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-label text-xs uppercase tracking-[0.15em] text-coralum-slate">
          Our team
        </p>
        <h2 className="mt-3 font-serif text-4xl text-coralum-navy">Meet the team</h2>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <Image
                src={member.photo}
                alt={member.name}
                width={180}
                height={180}
                className="size-[180px] rounded-full object-cover"
              />
              <h3 className="mt-5 font-body text-lg font-medium text-coralum-navy">
                {member.name}
              </h3>
              <p className="mt-4 max-w-[270px] font-body text-[13px] leading-relaxed text-coralum-slate">
                {member.bio}
              </p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="mt-4"
              >
                <LinkedInBadge />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
