'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const STEPS = [
  { id: 'account', title: 'Create your account' },
  { id: 'role', title: 'Tell us about yourself' },
  { id: 'goal', title: "What's your portfolio goal?" },
  { id: 'mode', title: 'How do you want to build?' },
];

const ROLES = [
  { id: 'emerging_professional', label: 'Emerging Professional', desc: 'Student, career changer, or junior' },
  { id: 'experienced_operator', label: 'Experienced Professional', desc: 'Designer, engineer, manager, consultant' },
  { id: 'freelancer', label: 'Freelancer / Creator', desc: 'Independent professional or content creator' },
  { id: 'career_support', label: 'Career Support', desc: 'Mentor, coach, or workforce professional' },
];

const GOALS = [
  'Land a new job or internship',
  'Attract freelance clients',
  'Showcase my creative work',
  'Establish my professional brand',
  'Share my work with collaborators',
  'Other',
];

const MODES = [
  {
    id: 'ai_directed',
    label: 'AI-Directed',
    desc: 'AI analyzes your materials and recommends the best template, layout, and content. You review and approve.',
    badge: 'Recommended',
  },
  {
    id: 'template_first',
    label: 'Template First',
    desc: 'Browse templates, pick one you like, then let AI fill in the content from your materials.',
    badge: null,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', goal: '', mode: '' });

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const finish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    router.push('/workspace');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 450, height: 450, background: 'hsl(246 83% 62% / 0.07)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      
      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>YourWork</span>
          </Link>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? 'var(--brand-primary)' : 'var(--border-default)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-default)', borderRadius: 20, padding: 40, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

              {/* STEP 0: Account */}
              {step === 0 && (
                <>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Create your account</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Join thousands building better portfolios.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { id: 'name', label: 'Full Name', type: 'text', ph: 'Alex Morgan' },
                      { id: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
                      { id: 'password', label: 'Password', type: 'password', ph: 'At least 8 characters' },
                    ].map(f => (
                      <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{f.label}</label>
                        <input
                          id={f.id} type={f.type} placeholder={f.ph}
                          value={(form as any)[f.id]}
                          onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                          style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                          onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
                          onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 1: Role */}
              {step === 1 && (
                <>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Tell us about yourself</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>We'll tailor the experience to your situation.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ROLES.map(r => (
                      <button key={r.id} onClick={() => setForm(p => ({ ...p, role: r.id }))}
                        style={{
                          textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                          border: `1px solid ${form.role === r.id ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                          background: form.role === r.id ? 'var(--brand-primary-glow)' : 'var(--surface-overlay)',
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                        <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${form.role === r.id ? 'var(--brand-primary)' : 'var(--border-strong)'}`, background: form.role === r.id ? 'var(--brand-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {form.role === r.id && <Check size={11} color="white" strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{r.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 2: Goal */}
              {step === 2 && (
                <>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>What's your portfolio goal?</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>This helps AI craft the right narrative and tone.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {GOALS.map(g => (
                      <button key={g} onClick={() => setForm(p => ({ ...p, goal: g }))}
                        style={{
                          textAlign: 'left', padding: '12px 14px', borderRadius: 8,
                          border: `1px solid ${form.goal === g ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                          background: form.goal === g ? 'var(--brand-primary-glow)' : 'var(--surface-overlay)',
                          cursor: 'pointer', fontSize: 14, color: form.goal === g ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          fontWeight: form.goal === g ? 600 : 400, transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                        {form.goal === g && <Check size={14} color="var(--brand-primary)" />}
                        {g}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 3: Mode */}
              {step === 3 && (
                <>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>How do you want to build?</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>You can always change this later.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MODES.map(m => (
                      <button key={m.id} onClick={() => setForm(p => ({ ...p, mode: m.id }))}
                        style={{
                          textAlign: 'left', padding: '18px 18px', borderRadius: 12,
                          border: `1px solid ${form.mode === m.id ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                          background: form.mode === m.id ? 'var(--brand-primary-glow)' : 'var(--surface-overlay)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${form.mode === m.id ? 'var(--brand-primary)' : 'var(--border-strong)'}`, background: form.mode === m.id ? 'var(--brand-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {form.mode === m.id && <Check size={11} color="white" strokeWidth={3} />}
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</span>
                          {m.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'var(--brand-primary)', color: 'white', textTransform: 'uppercase' }}>{m.badge}</span>}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginLeft: 30 }}>{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          {step > 0
            ? <button onClick={prev} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'var(--surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}>
                <ArrowLeft size={15} /> Back
              </button>
            : <Link href="/login" style={{ fontSize: 14, color: 'var(--text-muted)' }}>Already have an account? <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Sign in</span></Link>
          }

          {step < STEPS.length - 1
            ? <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: 'var(--brand-primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', transition: 'all 0.15s' }}>
                Continue <ArrowRight size={15} />
              </button>
            : <button onClick={finish} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: loading ? 'var(--surface-overlay)' : 'var(--brand-primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : 'var(--shadow-brand)', transition: 'all 0.15s' }}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating…</> : <>Get Started <Zap size={15} /></>}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
