'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle, Circle, ArrowRight, Sparkles, Globe,
  Upload, Layers, PenTool, BarChart2, Clock, RefreshCw
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { CHECKLIST_ITEMS, MOCK_PROJECTS, MOCK_ASSETS, simulateGeneration, GENERATION_STEPS } from '@/lib/mock-data';
import type { GenerationStep } from '@/lib/types';

const QUICK_STATS = [
  { label: 'Projects Added', value: '3', icon: Layers, color: 'var(--brand-primary)' },
  { label: 'Assets Uploaded', value: '2', icon: Upload, color: 'var(--brand-secondary)' },
  { label: 'Portfolio Views', value: '48', icon: BarChart2, color: 'var(--success)' },
  { label: 'Last Updated', value: '2h ago', icon: Clock, color: 'var(--warning)' },
];

function WorkspaceDash() {
  const { state } = useApp();
  const toast = useToast();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState<GenerationStep[]>(GENERATION_STEPS.map(s => ({ ...s })));
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const checklist = CHECKLIST_ITEMS;
  const completedCount = checklist.filter(c => c.completed).length;
  const pct = Math.round((completedCount / checklist.length) * 100);

  const handleGenerate = async () => {
    setGenerating(true);
    setDone(false);
    setProgress(0);
    setSteps(GENERATION_STEPS.map(s => ({ ...s, status: 'pending' as const })));
    try {
      await simulateGeneration(
        state.selectedModel,
        (idx, status) => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status } : s)),
        setProgress,
      );
      setDone(true);
      toast('Portfolio draft generated! Head to the editor to review.', 'success');
    } catch {
      toast('Generation failed. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Good evening, {state.user?.displayName.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          {pct < 100 ? `Complete ${checklist.length - completedCount} more step${checklist.length - completedCount !== 1 ? 's' : ''} to publish your portfolio.` : 'Your portfolio is ready to publish!'}
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {QUICK_STATS.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Checklist */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Getting Started Checklist</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{completedCount} of {checklist.length} completed</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-primary)' }}>{pct}%</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: 'var(--surface-overlay)', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
              style={{ height: '100%', background: 'var(--brand-gradient)', borderRadius: 99 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {checklist.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => router.push(item.href)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 12px',
                  borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-overlay)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <div style={{ marginTop: 1, flexShrink: 0 }}>
                  {item.completed
                    ? <CheckCircle size={20} color="var(--success)" fill="var(--success)" style={{ opacity: 0.9 }} />
                    : <Circle size={20} color="var(--border-strong)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: item.completed ? 500 : 600, color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.completed ? 'line-through' : 'none', marginBottom: 2 }}>
                    {item.label}
                  </div>
                  {!item.completed && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.description}</div>}
                </div>
                {!item.completed && <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 3 }} />}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Generation panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Generate card */}
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'var(--brand-primary-glow)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: 'var(--shadow-brand)' }}>
                <Sparkles size={22} color="white" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Generate with AI</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                AI will analyze your resume and projects, then draft your entire portfolio. You review every section before publishing.
              </p>

              {!generating && !done && (
                <button onClick={handleGenerate} style={{ width: '100%', padding: '12px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: 'var(--shadow-brand)', transition: 'all 0.15s' }}>
                  <Sparkles size={16} /> Generate My Portfolio
                </button>
              )}

              {generating && (
                <div>
                  {/* Progress bar */}
                  <div style={{ height: 4, background: 'var(--surface-overlay)', borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--brand-gradient)', borderRadius: 99 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {steps.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {s.status === 'done' && <CheckCircle size={14} color="var(--success)" />}
                        {s.status === 'running' && <span className="spinner" style={{ width: 14, height: 14 }} />}
                        {s.status === 'pending' && <Circle size={14} color="var(--border-default)" />}
                        <span style={{ fontSize: 12, color: s.status === 'running' ? 'var(--text-primary)' : s.status === 'done' ? 'var(--text-muted)' : 'var(--text-disabled)', fontWeight: s.status === 'running' ? 600 : 400 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {done && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--success-bg)', border: '1px solid hsl(142 71% 45% / 0.25)', borderRadius: 8, marginBottom: 12 }}>
                    <CheckCircle size={16} color="var(--success)" />
                    <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Draft generated successfully!</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push('/editor')} style={{ flex: 1, padding: '10px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: 'var(--shadow-brand)' }}>
                      <PenTool size={14} /> Review Draft
                    </button>
                    <button onClick={() => { setDone(false); handleGenerate(); }} style={{ padding: '10px 12px', background: 'var(--surface-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio status */}
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={16} color="var(--brand-secondary)" /> Portfolio Status
            </h3>
            {state.currentPortfolio && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 99, background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid hsl(142 71% 45% / 0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {state.currentPortfolio.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Template</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>Minimal Professional</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Public URL</span>
                  <a href={`/p/${state.currentPortfolio.slug}`} target="_blank" style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 500 }}>
                    yourwork.io/{state.currentPortfolio.slug}
                  </a>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => router.push('/editor')} style={{ flex: 1, padding: '9px', background: 'var(--surface-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 7, fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>
                    Edit Portfolio
                  </button>
                  <a href={`/p/${state.currentPortfolio.slug}`} target="_blank" style={{ flex: 1, padding: '9px', background: 'var(--surface-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 7, fontWeight: 500, fontSize: 13, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
                    View Live
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppLayout title="Workspace">
          <WorkspaceDash />
        </AppLayout>
      </ToastProvider>
    </AppProvider>
  );
}
