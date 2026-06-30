'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Layers, PenTool, Layout, Settings,
  ChevronRight, Zap, LogOut, ExternalLink, Globe
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getInitials } from '@/lib/mock-data';

const NAV = [
  { href: '/workspace', icon: LayoutDashboard, label: 'Workspace' },
  { href: '/studio', icon: Layers, label: 'Content Studio' },
  { href: '/templates', icon: Layout, label: 'Templates' },
  { href: '/editor', icon: PenTool, label: 'Portfolio Editor' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useApp();
  const { user, currentPortfolio } = state;

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            YourWork
          </span>
        </div>
      </div>

      {/* Portfolio status chip */}
      {currentPortfolio && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            background: 'var(--surface-overlay)',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 2 }}>Portfolio</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentPortfolio.title}
              </div>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
              background: currentPortfolio.status === 'published' ? 'var(--success-bg)' : 'var(--surface-active)',
              color: currentPortfolio.status === 'published' ? 'var(--success)' : 'var(--text-muted)',
              border: `1px solid ${currentPortfolio.status === 'published' ? 'hsl(142 71% 45% / 0.25)' : 'var(--border-default)'}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}>
              {currentPortfolio.status}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{ display: 'block', marginBottom: 2 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                background: active ? 'hsl(246 83% 62% / 0.12)' : 'transparent',
                color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </div>
            </Link>
          );
        })}

        {/* View public portfolio */}
        {currentPortfolio?.status === 'published' && (
          <Link href={`/p/${currentPortfolio.slug}`} target="_blank" style={{ display: 'block', marginTop: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              color: 'var(--brand-secondary)', fontSize: 14,
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Globe size={16} />
              View Live Portfolio
              <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
            </div>
          </Link>
        )}
      </nav>

      {/* User profile footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 99,
              background: 'var(--brand-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {getInitials(user.displayName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            <button onClick={() => { logout(); router.push('/login'); }} title="Sign out"
              style={{ color: 'var(--text-muted)', display: 'flex', cursor: 'pointer', padding: 4, borderRadius: 6, background: 'none', border: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
