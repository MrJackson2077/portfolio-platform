'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AI_MODELS } from '@/lib/mock-data';
import type { AIModel } from '@/lib/types';

export function AppTopBar({ title }: { title?: string }) {
  const { state, setModel } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AI_MODELS.find(m => m.id === state.selectedModel) || AI_MODELS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const speedColor = { fast: 'var(--success)', medium: 'var(--warning)', slow: 'var(--text-muted)' }[current.speed];

  return (
    <header className="app-topbar">
      {title && <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{title}</h1>}
      {!title && <div style={{ flex: 1 }} />}

      {/* AI Model selector */}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 12px',
            background: 'var(--surface-overlay)',
            border: '1px solid var(--border-default)',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)',
            transition: 'all 0.15s',
          }}
        >
          <Cpu size={14} color="var(--brand-primary)" />
          <span>{current.name}</span>
          <span style={{ fontSize: 11, color: speedColor, background: `${speedColor}18`, padding: '1px 6px', borderRadius: 99 }}>
            {current.speed}
          </span>
          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {open && (
          <div className="dropdown-menu" style={{ right: 0, top: 'calc(100% + 8px)', width: 320 }}>
            <div style={{ padding: '8px 14px 6px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Select AI Model
            </div>
            {AI_MODELS.map(m => (
              <div
                key={m.id}
                className={`dropdown-item ${m.id === state.selectedModel ? 'active' : ''}`}
                onClick={() => { setModel(m.id as AIModel); setOpen(false); }}
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 14px', gap: 2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <Zap size={13} />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>{m.provider}</span>
                  {m.badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 99, background: 'var(--brand-primary-glow)', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      {m.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 21 }}>{m.description}</p>
                <div style={{ display: 'flex', gap: 6, marginLeft: 21 }}>
                  <span style={{ fontSize: 10, color: { fast: 'var(--success)', medium: 'var(--warning)', slow: 'var(--text-muted)' }[m.speed] }}>⚡ {m.speed}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {m.quality} quality</span>
                  {m.free && <span style={{ fontSize: 10, color: 'var(--success)' }}>· Free</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
