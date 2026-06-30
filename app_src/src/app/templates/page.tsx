'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { TEMPLATES } from '@/lib/mock-data';

function TemplatesContent() {
  const { state, setPortfolio } = useApp();
  const toast = useToast();
  const [selected, setSelected] = useState(state.currentPortfolio?.templateId || 'minimal_professional');
  const [preview, setPreview] = useState<string | null>(null);

  const apply = (id: string) => {
    setSelected(id as any);
    if (state.currentPortfolio) {
      setPortfolio({ ...state.currentPortfolio, templateId: id as any });
    }
    toast('Template applied!', 'success');
  };

  const colorDot = (c: string) => <span style={{ width: 12, height: 12, borderRadius: 99, background: c, display: 'inline-block' }} />;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>Template Gallery</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Choose a template that fits your style. You can switch anytime without losing content.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {TEMPLATES.map((t, i) => {
          const isActive = selected === t.id;
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: 'var(--surface-raised)', border: `2px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: isActive ? 'var(--shadow-brand)' : 'none' }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}>

              {/* Preview area */}
              <div style={{ height: 180, background: t.previewGradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                {/* Mock content lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 6, borderRadius: 99, background: t.accentColor, opacity: 0.9 }} />
                  <div style={{ width: 120, height: 4, borderRadius: 99, background: t.accentColor, opacity: 0.5 }} />
                  <div style={{ width: 100, height: 3, borderRadius: 99, background: t.accentColor, opacity: 0.3 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {[60, 80, 70].map((w, j) => <div key={j} style={{ width: w, height: 40, borderRadius: 6, background: t.accentColor, opacity: 0.15 }} />)}
                  </div>
                </div>
                {isActive && (
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 99, background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
                    <Check size={14} color="white" strokeWidth={3} />
                  </div>
                )}
                {i === 0 && (
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'hsl(246 83% 62% / 0.9)', borderRadius: 99, backdropFilter: 'blur(8px)' }}>
                    <Sparkles size={10} color="white" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Pick</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t.name}</h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {t.tags.map(tag => <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'var(--surface-overlay)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tag}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {t.previewColors.map((c, j) => <span key={j} style={{ width: 14, height: 14, borderRadius: 99, background: c, display: 'inline-block', border: '1px solid var(--border-subtle)' }} />)}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>{t.description}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => apply(t.id)} style={{ flex: 1, padding: '9px', background: isActive ? 'var(--success-bg)' : 'var(--brand-primary)', color: isActive ? 'var(--success)' : 'white', border: `1px solid ${isActive ? 'hsl(142 71% 45% / 0.3)' : 'transparent'}`, borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: isActive ? 'none' : 'var(--shadow-brand)', transition: 'all 0.15s' }}>
                    {isActive ? <><Check size={13} /> Applied</> : 'Use Template'}
                  </button>
                  <a href={`/p/alex-morgan`} target="_blank" style={{ padding: '9px 14px', background: 'var(--surface-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: 7, fontWeight: 500, fontSize: 13, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    Preview
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppLayout title="Template Gallery">
          <TemplatesContent />
        </AppLayout>
      </ToastProvider>
    </AppProvider>
  );
}
