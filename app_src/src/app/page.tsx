'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Sparkles, Globe, Check, Zap, Shield, LayoutTemplate } from 'lucide-react';
import type { Variants } from 'framer-motion';

const FEATURES = [
  { icon: Upload, title: 'Upload Your Materials', desc: 'Resume, work documents, project links, media. We accept PDF, DOCX, images, and more.' },
  { icon: Sparkles, title: 'AI Extracts & Drafts', desc: 'Your chosen model analyzes your materials, extracts facts, and drafts every portfolio section.' },
  { icon: LayoutTemplate, title: 'Review & Customize', desc: 'Accept, edit, or regenerate any section. Switch templates, adjust colors and layout.' },
  { icon: Globe, title: 'Publish in Seconds', desc: 'Your portfolio goes live at a shareable URL. SEO-ready, mobile-responsive, accessible.' },
];

const SOCIAL_PROOF = [
  { quote: "I had a portfolio up in under 20 minutes. The AI nailed my tone perfectly.", name: 'Jordan K.', role: 'Product Designer' },
  { quote: "Finally a tool that doesn't require me to start from scratch. It understood my work.", name: 'Maya T.', role: 'Senior Engineer' },
  { quote: "I helped three students in my cohort build portfolios this week. Incredible time saver.", name: 'Chris R.', role: 'Career Coach' },
];

const TEMPLATE_PREVIEWS = [
  { name: 'Minimal Professional', color: 'hsl(246,83%,62%)', bg: 'hsl(225,22%,10%)' },
  { name: 'Editorial Case Study', color: 'hsl(38,92%,50%)', bg: 'hsl(30,20%,10%)' },
  { name: 'Visual Showcase', color: 'hsl(280,80%,60%)', bg: 'hsl(280,30%,8%)' },
  { name: 'Builder / Technical', color: 'hsl(196,94%,52%)', bg: 'hsl(210,30%,6%)' },
];

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--surface-bg)', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'hsl(225 22% 6% / 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>YourWork</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 8, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Sign In
          </Link>
          <Link href="/signup" style={{
            fontSize: 14, fontWeight: 600, color: 'white',
            padding: '9px 20px', borderRadius: 8,
            background: 'var(--brand-primary)',
            boxShadow: '0 2px 12px var(--brand-primary-glow)',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-brand)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px var(--brand-primary-glow)'; }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated glows */}
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'hsl(246 83% 62% / 0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '20%', right: '15%', width: 350, height: 350, background: 'hsl(280 80% 60% / 0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            padding: '6px 16px 6px 8px', borderRadius: 99,
            background: 'hsl(246 83% 62% / 0.1)', border: '1px solid hsl(246 83% 62% / 0.25)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--brand-primary)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>AI-powered content extraction from your resume</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
            <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Your work deserves
            </span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>a great home.</span>
          </h1>

          <p style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' }}>
            Upload your resume and projects. AI drafts a polished portfolio. You review, refine, and publish — in minutes, not weeks.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px',
              background: 'var(--brand-primary)', color: 'white', borderRadius: 10,
              fontWeight: 700, fontSize: 16, boxShadow: 'var(--shadow-brand)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px hsl(246 83% 62% / 0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-brand)'; }}>
              Build My Portfolio <ArrowRight size={18} />
            </Link>
            <Link href="/p/alex-morgan" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px',
              background: 'var(--surface-raised)', color: 'var(--text-primary)', borderRadius: 10,
              fontWeight: 600, fontSize: 16, border: '1px solid var(--border-default)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; }}>
              See a Demo Portfolio
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {['No design skills needed', 'Private by default', 'Publish in minutes'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <Check size={14} color="var(--success)" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '96px 48px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-primary)', marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>From scattered materials<br />to a published portfolio</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} style={{
                background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>0{i + 1}</div>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color="var(--brand-primary)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section style={{ padding: '80px 48px', background: 'var(--surface-base)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-primary)', marginBottom: 12 }}>Templates</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>4 curated templates, built for every profession</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {TEMPLATE_PREVIEWS.map(t => (
              <motion.div key={t.name} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'transform 0.2s', }}
                whileHover={{ scale: 1.02, y: -4 }}>
                <div style={{ height: 140, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                  <div style={{ width: 40, height: 4, borderRadius: 99, background: t.color }} />
                  <div style={{ width: 60, height: 4, borderRadius: 99, background: t.color, opacity: 0.5 }} />
                  <div style={{ width: 52, height: 4, borderRadius: 99, background: t.color, opacity: 0.3 }} />
                </div>
                <div style={{ padding: '14px 16px', background: 'var(--surface-raised)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>People love YourWork</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {SOCIAL_PROOF.map(s => (
              <motion.div key={s.name} variants={fadeUp} style={{
                background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 28,
              }}>
                <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 20 }}>"{s.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid var(--border-subtle)' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '64px 48px', background: 'var(--surface-raised)', borderRadius: 24, border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--brand-gradient-subtle)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <Shield size={40} color="var(--brand-primary)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em' }}>Private by default</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              Every portfolio starts as a private draft. Nothing is public until you explicitly choose to publish it.
            </p>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
              background: 'var(--brand-primary)', color: 'white', borderRadius: 10,
              fontWeight: 700, fontSize: 16, boxShadow: 'var(--shadow-brand)',
            }}>
              Start Building — It's Free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '32px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>YourWork</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 YourWork. Build your narrative.</p>
      </footer>
    </div>
  );
}
