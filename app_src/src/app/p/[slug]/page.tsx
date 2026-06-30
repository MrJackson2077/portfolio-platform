import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PORTFOLIO, MOCK_PROFILE, MOCK_PROJECTS } from '@/lib/mock-data';
import { Mail, Globe, GitBranch, Link2, ExternalLink } from 'lucide-react';

// ── Block content types ───────────────────────────────────
interface HeroContent    { name: string; headline: string; subheadline?: string; ctaText?: string; }
interface AboutContent   { title: string; body: string; highlights?: string[]; }
interface SkillCategory  { name: string; skills: string[]; }
interface SkillsContent  { title: string; categories?: SkillCategory[]; }
interface ContactContent { title: string; body?: string; email?: string; }

export const metadata: Metadata = {
  title: 'Alex Morgan — Full-Stack Engineer',
  description: 'Portfolio of Alex Morgan, a full-stack engineer specializing in React and Node.js.',
};

export default function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  // For demo, only one portfolio exists
  if (params.slug !== 'alex-morgan') notFound();
  const p = MOCK_PORTFOLIO;
  const profile = MOCK_PROFILE;
  const projects = MOCK_PROJECTS.filter(pr => pr.confidentiality !== 'private');
  const blocks = p.blocks.filter(b => b.visible);

  const getBlock = (type: string) => blocks.find(b => b.blockType === type);
  const hero    = getBlock('hero')?.content    as HeroContent    | undefined;
  const about   = getBlock('about')?.content   as AboutContent   | undefined;
  const skills  = getBlock('skills')?.content  as SkillsContent  | undefined;
  const contact = getBlock('contact')?.content as ContactContent | undefined;

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(225 22% 6%)', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Hero */}
      {hero && (
        <section style={{ padding: '80px 48px 72px', textAlign: 'center', background: 'linear-gradient(180deg, hsl(246 60% 10%) 0%, hsl(225 22% 6%) 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'hsl(246 83% 62% / 0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
            <div style={{ width: 88, height: 88, borderRadius: 99, background: 'linear-gradient(135deg, hsl(246,83%,62%), hsl(280,80%,65%))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32, fontWeight: 900, color: 'white', boxShadow: '0 8px 32px hsl(246 83% 62% / 0.4)' }}>
              {profile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: 'hsl(220 20% 96%)', marginBottom: 12, letterSpacing: '-0.025em' }}>{hero.name}</h1>
            <p style={{ fontSize: 18, color: 'hsl(220 15% 72%)', marginBottom: 8 }}>{hero.headline}</p>
            {hero.subheadline && <p style={{ fontSize: 15, color: 'hsl(220 12% 55%)', marginBottom: 28, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>{hero.subheadline}</p>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {hero.ctaText && <a href="#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'hsl(246 83% 62%)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px hsl(246 83% 62% / 0.35)' }}>{hero.ctaText}</a>}
              {contact?.email && <a href={`mailto:${contact.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'hsl(225 15% 12%)', color: 'hsl(220 20% 86%)', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid hsl(225 12% 22%)' }}><Mail size={16} />Contact</a>}
            </div>
            {/* Social links */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              {profile.github && <a href={profile.github} target="_blank" style={{ color: 'hsl(220 12% 55%)', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'hsl(220 20% 86%)')} onMouseLeave={e => (e.currentTarget.style.color = 'hsl(220 12% 55%)')}><GitBranch size={20} /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" style={{ color: 'hsl(220 12% 55%)', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'hsl(220 20% 86%)')} onMouseLeave={e => (e.currentTarget.style.color = 'hsl(220 12% 55%)')}><Link2 size={20} /></a>}
              {profile.website && <a href={profile.website} target="_blank" style={{ color: 'hsl(220 12% 55%)', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'hsl(220 20% 86%)')} onMouseLeave={e => (e.currentTarget.style.color = 'hsl(220 12% 55%)')}><Globe size={20} /></a>}
            </div>
          </div>
        </section>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
        {/* About */}
        {about && (
          <section style={{ padding: '64px 0', borderBottom: '1px solid hsl(225 14% 13%)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'hsl(220 20% 96%)', marginBottom: 16, letterSpacing: '-0.02em' }}>{about.title}</h2>
            <p style={{ fontSize: 16, color: 'hsl(220 12% 65%)', lineHeight: 1.75, maxWidth: 680 }}>{about.body}</p>
            {about.highlights && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                {about.highlights.map((h: string) => (
                  <span key={h} style={{ fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 99, background: 'hsl(246 83% 62% / 0.1)', color: 'hsl(246 83% 72%)', border: '1px solid hsl(246 83% 62% / 0.25)' }}>{h}</span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Projects */}
        <section id="projects" style={{ padding: '64px 0', borderBottom: '1px solid hsl(225 14% 13%)' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'hsl(220 20% 96%)', marginBottom: 6, letterSpacing: '-0.02em' }}>Selected Work</h2>
          <p style={{ fontSize: 15, color: 'hsl(220 10% 50%)', marginBottom: 32 }}>Projects I've built and shipped.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
            {projects.map(proj => (
              <div key={proj.id} style={{ background: 'hsl(225 16% 10%)', border: '1px solid hsl(225 12% 16%)', borderRadius: 16, padding: 28, transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(246 83% 62% / 0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(225 12% 16%)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'hsl(220 20% 96%)', marginBottom: 4 }}>{proj.title}</h3>
                    <p style={{ fontSize: 13, color: 'hsl(246 83% 72%)', fontWeight: 600 }}>{proj.role}</p>
                  </div>
                  {proj.externalLinks[0] && (
                    <a href={proj.externalLinks[0]} target="_blank" style={{ color: 'hsl(220 10% 50%)', display: 'flex' }}><ExternalLink size={16} /></a>
                  )}
                </div>
                <p style={{ fontSize: 14, color: 'hsl(220 12% 62%)', lineHeight: 1.65, marginBottom: 16 }}>{proj.summary}</p>
                {proj.outcomes.length > 0 && (
                  <ul style={{ marginBottom: 16, paddingLeft: 0 }}>
                    {proj.outcomes.slice(0, 2).map(o => (
                      <li key={o} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'hsl(220 12% 62%)', marginBottom: 4 }}>
                        <span style={{ color: 'hsl(142 71% 45%)', marginTop: 2, flexShrink: 0 }}>✓</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {proj.skills.slice(0, 5).map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'hsl(225 14% 14%)', color: 'hsl(220 10% 55%)', border: '1px solid hsl(225 12% 18%)' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        {skills && (
          <section style={{ padding: '64px 0', borderBottom: '1px solid hsl(225 14% 13%)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'hsl(220 20% 96%)', marginBottom: 24, letterSpacing: '-0.02em' }}>{skills.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {skills.categories?.map((cat: SkillCategory) => (
                <div key={cat.name} style={{ background: 'hsl(225 16% 10%)', border: '1px solid hsl(225 12% 16%)', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: 'hsl(246 83% 72%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{cat.name}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {cat.skills.map((s: string) => (
                      <span key={s} style={{ fontSize: 13, padding: '4px 12px', borderRadius: 99, background: 'hsl(225 14% 14%)', color: 'hsl(220 15% 70%)', border: '1px solid hsl(225 12% 18%)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {contact && (
          <section style={{ padding: '64px 0 80px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'hsl(220 20% 96%)', marginBottom: 10, letterSpacing: '-0.02em' }}>{contact.title}</h2>
            {contact.body && <p style={{ fontSize: 15, color: 'hsl(220 12% 60%)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.65 }}>{contact.body}</p>}
            {contact.email && <a href={`mailto:${contact.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: 'hsl(246 83% 62%)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px hsl(246 83% 62% / 0.35)', transition: 'all 0.15s' }}>
              <Mail size={18} /> {contact.email}
            </a>}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid hsl(225 14% 13%)', padding: '24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'hsl(220 8% 40%)' }}>Built with <a href="/" style={{ color: 'hsl(246 83% 65%)', fontWeight: 600, textDecoration: 'none' }}>YourWork</a></p>
      </footer>
    </div>
  );
}
