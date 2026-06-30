'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Eye, EyeOff, Check, RefreshCw, Sparkles, Monitor, Tablet, Smartphone, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { MOCK_PORTFOLIO, MOCK_PROJECTS } from '@/lib/mock-data';

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero / Introduction',
  about: 'About Me',
  project_collection: 'Selected Work',
  experience: 'Experience',
  skills: 'Skills & Technologies',
  contact: 'Contact',
};

function EditorContent() {
  const { state, setPortfolio } = useApp();
  const toast = useToast();
  const portfolio = state.currentPortfolio || MOCK_PORTFOLIO;
  const [blocks, setBlocks] = useState(portfolio.blocks);
  const [preview, setPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(portfolio.status === 'published');
  const [aiSection, setAiSection] = useState<string | null>(null);
  const [aiRewriting, setAiRewriting] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');

  const toggleVisible = (id: string) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b));

  const publish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1400));
    setPublished(true);
    setPortfolio({ ...portfolio, status: 'published', visibility: 'public' });
    toast('Portfolio published! 🎉', 'success');
    setPublishing(false);
  };

  const unpublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 800));
    setPublished(false);
    setPortfolio({ ...portfolio, status: 'draft', visibility: 'draft' });
    toast('Portfolio unpublished.', 'info');
    setPublishing(false);
  };

  const aiRewrite = async () => {
    setAiRewriting(true);
    await new Promise(r => setTimeout(r, 2200));
    setAiRewriting(false);
    setAiInstruction('');
    toast('Section rewritten by AI. Review and save!', 'success');
  };

  const previewWidth = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 60px)', overflow: 'hidden', margin: '-32px', padding: 0 }}>
      {/* LEFT: Section tree */}
      <div style={{ width: 280, flexShrink: 0, background: 'var(--surface-base)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Sections</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reorder and toggle visibility</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {blocks.map((b, i) => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px', borderRadius: 8, marginBottom: 4, background: aiSection === b.id ? 'var(--brand-primary-glow)' : 'transparent', border: `1px solid ${aiSection === b.id ? 'var(--border-brand)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => setAiSection(aiSection === b.id ? null : b.id)}
              onMouseEnter={e => { if (aiSection !== b.id) (e.currentTarget as HTMLElement).style.background = 'var(--surface-overlay)'; }}
              onMouseLeave={e => { if (aiSection !== b.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <GripVertical size={14} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: b.visible ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 1 }}>{BLOCK_LABELS[b.blockType] || b.blockType}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>#{i + 1}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleVisible(b.id); }} style={{ color: b.visible ? 'var(--text-secondary)' : 'var(--text-disabled)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
                {b.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          ))}
        </div>

        {/* AI Assist panel */}
        {aiSection && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles size={14} color="var(--brand-primary)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Rewrite</span>
            </div>
            <textarea value={aiInstruction} onChange={e => setAiInstruction(e.target.value)} placeholder="Give AI instructions (e.g. 'Make it more concise' or 'Use a confident tone')"
              rows={3} style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '8px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 8 }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }} />
            <button onClick={aiRewrite} disabled={aiRewriting} style={{ width: '100%', padding: '9px', background: aiRewriting ? 'var(--surface-overlay)' : 'var(--brand-primary)', color: aiRewriting ? 'var(--text-muted)' : 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: aiRewriting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {aiRewriting ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Rewriting…</> : <><RefreshCw size={12} /> Rewrite with AI</>}
            </button>
          </div>
        )}
      </div>

      {/* CENTER: Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Preview toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'var(--surface-base)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface-overlay)', padding: 4, borderRadius: 8 }}>
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([mode, Icon]) => (
              <button key={mode} onClick={() => setPreview(mode)} style={{ padding: '6px 10px', borderRadius: 6, background: preview === mode ? 'var(--surface-raised)' : 'transparent', color: preview === mode ? 'var(--text-primary)' : 'var(--text-muted)', border: preview === mode ? '1px solid var(--border-default)' : '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: preview === mode ? 600 : 400, transition: 'all 0.15s' }}>
                <Icon size={13} />
                <span style={{ textTransform: 'capitalize' }}>{mode}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          {published
            ? <button onClick={unpublish} disabled={publishing} style={{ padding: '8px 18px', background: 'var(--surface-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                {publishing ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Unpublishing…</> : <><EyeOff size={13} /> Unpublish</>}
              </button>
            : <button onClick={publish} disabled={publishing} style={{ padding: '8px 18px', background: publishing ? 'var(--surface-overlay)' : 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: publishing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: publishing ? 'none' : 'var(--shadow-brand)', transition: 'all 0.15s' }}>
                {publishing ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Publishing…</> : <><Globe size={13} /> Publish</>}
              </button>
          }
          {published && <a href={`/p/${portfolio.slug}`} target="_blank" style={{ padding: '8px 16px', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid hsl(142 71% 45% / 0.3)', borderRadius: 7, fontWeight: 600, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={13} /> Live
          </a>}
        </div>

        {/* Preview iframe-style */}
        <div style={{ flex: 1, overflow: 'auto', background: 'hsl(220 14% 4%)', padding: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: previewWidth[preview], maxWidth: '100%', background: 'var(--surface-bg)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', transition: 'width 0.3s ease', minHeight: 600 }}>
            {/* Rendered portfolio preview */}
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
              {/* Hero */}
              {blocks.find(b => b.blockType === 'hero')?.visible && (() => {
                const c = blocks.find(b => b.blockType === 'hero')!.content as any;
                return (
                  <div style={{ padding: '60px 40px', background: 'linear-gradient(135deg, hsl(246 83% 12%), hsl(225 22% 8%))', textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 99, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, fontWeight: 900, color: 'white' }}>AM</div>
                    <h1 style={{ fontSize: preview === 'mobile' ? 28 : 36, fontWeight: 900, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>{c.name}</h1>
                    <p style={{ fontSize: 16, color: 'hsl(220 20% 75%)', marginBottom: 8 }}>{c.headline}</p>
                    {c.subheadline && <p style={{ fontSize: 14, color: 'hsl(220 15% 60%)', maxWidth: 500, margin: '0 auto 24px' }}>{c.subheadline}</p>}
                    {c.ctaText && <a href="#projects" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--brand-primary)', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{c.ctaText}</a>}
                  </div>
                );
              })()}
              {/* About */}
              {blocks.find(b => b.blockType === 'about')?.visible && (() => {
                const c = blocks.find(b => b.blockType === 'about')!.content as any;
                return (
                  <div style={{ padding: '48px 40px', borderBottom: '1px solid hsl(225 14% 14%)' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>{c.title}</h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 680 }}>{c.body}</p>
                    {c.highlights && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                      {c.highlights.map((h: string) => <span key={h} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'var(--brand-primary-glow)', color: 'var(--brand-primary)', border: '1px solid var(--border-brand)' }}>{h}</span>)}
                    </div>}
                  </div>
                );
              })()}
              {/* Projects */}
              {blocks.find(b => b.blockType === 'project_collection')?.visible && (() => {
                const c = blocks.find(b => b.blockType === 'project_collection')!.content as any;
                return (
                  <div id="projects" style={{ padding: '48px 40px', borderBottom: '1px solid hsl(225 14% 14%)' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{c.title}</h2>
                    {c.subtitle && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>{c.subtitle}</p>}
                    <div style={{ display: 'grid', gridTemplateColumns: preview === 'mobile' ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
                      {MOCK_PROJECTS.filter(p => p.confidentiality !== 'private').slice(0, 2).map(p => (
                        <div key={p.id} style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{p.title}</h3>
                          <p style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 600, marginBottom: 8 }}>{p.role}</p>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.summary.slice(0, 120)}…</p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                            {p.skills.slice(0, 4).map(s => <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'var(--surface-overlay)', color: 'var(--text-muted)' }}>{s}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {/* Skills */}
              {blocks.find(b => b.blockType === 'skills')?.visible && (() => {
                const c = blocks.find(b => b.blockType === 'skills')!.content as any;
                return (
                  <div style={{ padding: '48px 40px', borderBottom: '1px solid hsl(225 14% 14%)' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>{c.title}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: preview === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
                      {c.categories?.map((cat: any) => (
                        <div key={cat.name} style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16 }}>
                          <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{cat.name}</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {cat.skills.map((s: string) => <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: 'var(--surface-overlay)', color: 'var(--text-secondary)' }}>{s}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {/* Contact */}
              {blocks.find(b => b.blockType === 'contact')?.visible && (() => {
                const c = blocks.find(b => b.blockType === 'contact')!.content as any;
                return (
                  <div style={{ padding: '48px 40px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{c.title}</h2>
                    {c.body && <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>{c.body}</p>}
                    {c.email && <a href={`mailto:${c.email}`} style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--brand-primary)', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Get in Touch</a>}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppLayout>
          <EditorContent />
        </AppLayout>
      </ToastProvider>
    </AppProvider>
  );
}
