import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GitHubIcon, LinkedInIcon, WebsiteIcon, YouTubeIcon } from '@/components/icons';
import PitchDeckNav from './PitchDeckNav';

type Pillar = { title: string; desc: string };
type Stat = { value: string; label: string };
type Service = { title: string; desc: string; tags: string[] };
type Step = { title: string; desc: string };
type Project = { title: string; desc: string; result: string };
type Pain = { title: string; desc: string };
type TeamMember = {
  name: string;
  role: string;
  username: string;
  bio: string;
  photo?: string;
  social: {
    github?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
};

const partnerLogos = ['/logos/aws.svg', '/logos/hetzner.svg', '/logos/arvancloud.svg'];

export default async function PitchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const problems = t.raw('pitch.problem.items') as Pain[];
  const whyItems = t.raw('pitch.why.items') as Pain[];
  const stats = t.raw('stats') as Stat[];
  const services = t.raw('services.items') as Service[];
  const processSteps = t.raw('process.steps') as Step[];
  const projects = t.raw('projects.items') as Project[];
  const pillars = t.raw('hero.pillars') as Pillar[];
  const teamMembers = t.raw('team.members') as TeamMember[];

  const deckSections = [
    { id: 'cover', label: t('pitch.deck.cover') },
    { id: 'problem', label: t('pitch.deck.problem') },
    { id: 'solution', label: t('pitch.deck.solution') },
    { id: 'why', label: t('pitch.deck.why') },
    { id: 'traction', label: t('pitch.deck.traction') },
    { id: 'process', label: t('pitch.deck.process') },
    { id: 'team', label: t('pitch.deck.team') },
    { id: 'partners', label: t('pitch.deck.partners') },
    { id: 'closing', label: t('pitch.deck.closing') },
  ];

  return (
    <div className="pitch-page">
      <PitchDeckNav sections={deckSections} />

      {/* Cover */}
      <section id="cover" className="section pitch-slide pitch-cover">
        <div className="container">
          <span className="eyebrow">{t('pitch.cover.eyebrow')}</span>
          <h1 className="display">{t('hero.title')}</h1>
          <p className="lead">{t('hero.subtitle')}</p>
          <div className="cta-row">
            <a className="btn primary" href={`/${locale}#contact`}>
              {t('hero.ctaPrimary')}
            </a>
            <a className="btn ghost" href="#solution">
              {t('hero.ctaSecondary')}
            </a>
          </div>
          <p className="meta-note">{t('hero.note')}</p>
          <span className="pitch-scroll-hint">{t('pitch.cover.scroll')}</span>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="section pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('pitch.problem.eyebrow')}</span>
            <h2 className="section-title">{t('pitch.problem.title')}</h2>
            <p className="section-subtitle">{t('pitch.problem.subtitle')}</p>
          </div>
          <div className="pitch-grid">
            {problems.map((item, index) => (
              <div key={item.title} className="pitch-card">
                <span className="pitch-card-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="section pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('nav.services')}</span>
            <h2 className="section-title">{t('services.title')}</h2>
            <p className="section-subtitle">{t('services.subtitle')}</p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <h3>{service.title}</h3>
                <p className="section-subtitle">{service.desc}</p>
                <div className="tag-list">
                  {service.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Raha */}
      <section id="why" className="section section-alt pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('pitch.why.eyebrow')}</span>
            <h2 className="section-title">{t('pitch.why.title')}</h2>
          </div>
          <div className="pitch-why-grid">
            {whyItems.map((item) => (
              <div key={item.title} className="pitch-why-item">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction */}
      <section id="traction" className="section pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('pitch.traction.eyebrow')}</span>
            <h2 className="section-title">{t('pitch.traction.title')}</h2>
          </div>
        </div>
        <div className="stats-band">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p className="section-subtitle">{project.desc}</p>
                <p className="result">{project.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section process-section pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('nav.process')}</span>
            <h2 className="section-title">{t('process.title')}</h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={step.title} className="process-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('nav.team')}</span>
            <h2 className="section-title">{t('team.title')}</h2>
            <p className="section-subtitle">{t('team.subtitle')}</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.username} className="team-card">
                <Image
                  src={member.photo ?? `https://github.com/${member.username}.png`}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="team-photo"
                  style={member.photo ? { objectPosition: 'center 20%' } : undefined}
                  unoptimized
                />
                <div className="team-card-body">
                  <h3 className="team-name">{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-social">
                    {member.social.github && (
                      <a
                        href={`https://github.com/${member.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on GitHub`}
                      >
                        <GitHubIcon />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                    {member.social.youtube && (
                      <a
                        href={`https://youtube.com/${member.social.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on YouTube`}
                      >
                        <YouTubeIcon />
                      </a>
                    )}
                    {member.social.website && (
                      <a
                        href={member.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s website`}
                      >
                        <WebsiteIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud partners */}
      <section id="partners" className="section section-alt pitch-slide">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('pitch.partners.eyebrow')}</span>
            <h2 className="section-title">{t('pitch.partners.title')}</h2>
          </div>
          <div className="pitch-partners-grid">
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className="pitch-partner">
                {partnerLogos[index] && (
                  <Image
                    src={partnerLogos[index]}
                    alt={pillar.title}
                    width={40}
                    height={40}
                    className="pitch-partner-logo"
                  />
                )}
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section id="closing" className="section pitch-slide pitch-closing">
        <div className="container">
          <span className="eyebrow">{t('pitch.closing.eyebrow')}</span>
          <h2 className="display">{t('pitch.closing.title')}</h2>
          <p className="lead">{t('pitch.closing.subtitle')}</p>
          <div className="cta-row">
            <a className="btn primary" href={`/${locale}#contact`}>
              {t('pitch.closing.cta')}
            </a>
            <a className="btn ghost" href={`mailto:${t('contact.email')}`}>
              {t('pitch.closing.ctaSecondary')}
            </a>
          </div>
          <div className="pitch-closing-contact">
            <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
            <a href={`tel:${t('contact.phone')}`}>
              <bdi>{t('contact.phone')}</bdi>
            </a>
            <span>{t('contact.address')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
