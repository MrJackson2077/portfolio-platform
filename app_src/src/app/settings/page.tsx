'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Trash2, Download } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider, useToast } from '@/components/ui/Toast';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function SettingsContent() {
  const { state } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(state.user?.displayName || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [notifs, setNotifs] = useState({ portfolio_views: true, ai_complete: true, security: true, tips: false });

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast('Settings saved!', 'success');
  };

  const inputStyle = { width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage your account, privacy, and preferences.</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 28 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', fontSize: 14, fontWeight: tab === id ? 600 : 400, color: tab === id ? 'var(--brand-primary)' : 'var(--text-muted)', background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: 2, borderBottomColor: tab === id ? 'var(--brand-primary)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {tab === 'account' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Account Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
            <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'var(--surface-overlay)' : 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: saving ? 'none' : 'var(--shadow-brand)' }}>
              {saving ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving…</> : 'Save Changes'}
            </button>
          </div>

          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Change Password</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Choose a strong, unique password for your account.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>{label}</label>
                  <input type="password" placeholder="••••••••" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              ))}
            </div>
            <button onClick={() => toast('Password updated!', 'success')} style={{ marginTop: 16, padding: '10px 24px', background: 'var(--surface-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Update Password
            </button>
          </div>

          <div style={{ background: 'var(--error-bg)', border: '1px solid hsl(0 84% 60% / 0.2)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--error)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><Trash2 size={16} /> Danger Zone</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Permanently delete your account and all associated data. This cannot be undone.</p>
            <button onClick={() => toast('Account deletion requires email confirmation. Check your inbox.', 'warning')} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--error)', border: '1px solid hsl(0 84% 60% / 0.4)', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Delete My Account
            </button>
          </div>
        </motion.div>
      )}

      {tab === 'privacy' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Privacy Controls</h2>
            {[
              { label: 'Portfolio Visibility', value: 'public', desc: 'Anyone with your URL can view your portfolio.' },
              { label: 'Search Engine Indexing', value: 'enabled', desc: 'Your portfolio may appear in Google search results.' },
              { label: 'Analytics', value: 'enabled', desc: 'Collect anonymous view counts for your portfolio.' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid hsl(142 71% 45% / 0.25)', textTransform: 'uppercase', flexShrink: 0, marginLeft: 16 }}>{item.value}</span>
              </div>
            ))}
            <button onClick={() => toast("Data export initiated. You'll receive an email shortly.", 'info')} style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--surface-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <Download size={14} /> Export My Data
            </button>
          </div>
        </motion.div>
      )}

      {tab === 'notifications' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Notification Preferences</h2>
            {([
              { key: 'portfolio_views', label: 'Portfolio view milestones', desc: 'When your portfolio reaches 10, 50, 100+ views.' },
              { key: 'ai_complete', label: 'AI generation complete', desc: 'When your AI portfolio draft is ready to review.' },
              { key: 'security', label: 'Security alerts', desc: 'Sign-ins from new devices or suspicious activity.' },
              { key: 'tips', label: 'Tips & product updates', desc: 'Monthly newsletter with portfolio improvement tips.' },
            ] as const).map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <button onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} style={{ width: 44, height: 24, borderRadius: 99, background: notifs[item.key] ? 'var(--brand-primary)' : 'var(--surface-overlay)', border: `1px solid ${notifs[item.key] ? 'var(--brand-primary)' : 'var(--border-strong)'}`, cursor: 'pointer', position: 'relative', flexShrink: 0, marginLeft: 16, transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: notifs[item.key] ? 22 : 2, width: 18, height: 18, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px hsl(0 0% 0% / 0.3)', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
            <button onClick={save} style={{ marginTop: 20, padding: '10px 24px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-brand)' }}>
              Save Preferences
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppLayout title="Settings">
          <SettingsContent />
        </AppLayout>
      </ToastProvider>
    </AppProvider>
  );
}
