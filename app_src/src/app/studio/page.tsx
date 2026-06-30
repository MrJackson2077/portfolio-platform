'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Link2, User, FolderOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { formatBytes, formatDate } from '@/lib/mock-data';

function ProfileTab() {
  const { state, setProfile } = useApp();
  const toast = useToast();
  const [form, setForm] = useState(state.profile || { fullName: '', headline: '', bio: '', location: '', primaryRole: '', email: '', website: '', linkedin: '', github: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setProfile(form as any);
    toast('Profile saved!', 'success');
    setSaving(false);
  };

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      <input type={type} value={(form as any)[key] || ''} placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
        onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Profile Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {field('Full Name', 'fullName', 'text', 'Alex Morgan')}
          {field('Primary Role', 'primaryRole', 'text', 'Software Engineer')}
        </div>
        {field('Headline', 'headline', 'text', 'Full-Stack Engineer & Product Builder')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Bio</label>
          <textarea value={(form as any).bio || ''} rows={4} placeholder="Tell your story..."
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {field('Location', 'location', 'text', 'San Francisco, CA')}
          {field('Email', 'email', 'email', 'you@example.com')}
          {field('Website', 'website', 'url', 'https://yoursite.com')}
          {field('LinkedIn', 'linkedin', 'url', 'https://linkedin.com/in/...')}
          {field('GitHub', 'github', 'url', 'https://github.com/...')}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'var(--surface-overlay)' : 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: saving ? 'none' : 'var(--shadow-brand)' }}>
            {saving ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving…</> : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const { state, addProject, deleteProject } = useApp();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', role: '', summary: '', startDate: '', endDate: '', confidentiality: 'public' });

  const handleAdd = () => {
    if (!form.title) { toast('Title is required.', 'error'); return; }
    addProject({ id: `proj_${Date.now()}`, workspaceId: 'ws_01', ...form, contributions: [], outcomes: [], skills: [], mediaUrls: [], externalLinks: [], status: 'draft', sortOrder: state.projects.length } as any);
    setShowModal(false);
    setForm({ title: '', role: '', summary: '', startDate: '', endDate: '', confidentiality: 'public' });
    toast('Project added!', 'success');
  };

  const confColor = { public: 'var(--success)', redact: 'var(--warning)', private: 'var(--error)' } as any;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Projects ({state.projects.length})</h2>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-brand)' }}>
          <Plus size={15} /> Add Project
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.projects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</h3>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${confColor[p.confidentiality]}18`, color: confColor[p.confidentiality], border: `1px solid ${confColor[p.confidentiality]}40`, textTransform: 'uppercase' }}>{p.confidentiality}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{p.role} · {p.startDate}{p.endDate ? ` → ${p.endDate}` : ' → Present'}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.summary}</p>
            </div>
            <button onClick={() => { deleteProject(p.id); toast('Project removed.', 'info'); }} style={{ padding: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--error)'; (e.currentTarget as HTMLElement).style.background = 'var(--error-bg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'none'; }}>
              <Trash2 size={15} />
            </button>
          </motion.div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Project">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Project Title', 'title', 'ClearFlow Dashboard'], ['Your Role', 'role', 'Lead Frontend Engineer'], ['Start Date', 'startDate', '2024-03'], ['End Date (optional)', 'endDate', '2024-11']].map(([label, key, ph]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Summary</label>
            <textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={3} placeholder="Describe this project..."
              style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Visibility</label>
            <select value={form.confidentiality} onChange={e => setForm(p => ({ ...p, confidentiality: e.target.value }))}
              style={{ width: '100%', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              <option value="public">Public</option>
              <option value="redact">Redacted (show capabilities, hide details)</option>
              <option value="private">Private (hidden from portfolio)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--surface-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleAdd} style={{ padding: '10px 24px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-brand)' }}>Add Project</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AssetsTab() {
  const { state, addAsset } = useApp();
  const toast = useToast();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(f => {
      addAsset({ id: `asset_${Date.now()}_${Math.random()}`, workspaceId: 'ws_01', fileName: f.name, mediaType: f.type.startsWith('image') ? 'image' : f.type === 'application/pdf' ? 'document' : 'other', mimeType: f.type, byteSize: f.size, scanStatus: 'clean', createdAt: new Date().toISOString() });
    });
    toast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded!`, 'success');
  };

  const typeIcon = (t: string) => t === 'image' ? '🖼️' : t === 'document' ? '📄' : '📁';

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Assets ({state.assets.length})</h2>
      <div
        onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        style={{ border: `2px dashed ${dragging ? 'var(--brand-primary)' : 'var(--border-default)'}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center', marginBottom: 24, background: dragging ? 'var(--brand-primary-glow)' : 'var(--surface-base)', transition: 'all 0.2s', cursor: 'pointer' }}>
        <Upload size={28} color={dragging ? 'var(--brand-primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: dragging ? 'var(--brand-primary)' : 'var(--text-secondary)', marginBottom: 4 }}>Drop files here to upload</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>PDF, DOCX, PNG, JPG, MP4 — max 50MB per file</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.assets.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
            <span style={{ fontSize: 22 }}>{typeIcon(a.mediaType)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.fileName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatBytes(a.byteSize)} · {a.mimeType}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: a.scanStatus === 'clean' ? 'var(--success-bg)' : 'var(--warning-bg)', color: a.scanStatus === 'clean' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${a.scanStatus === 'clean' ? 'hsl(142 71% 45% / 0.25)' : 'hsl(38 92% 50% / 0.25)'}`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {a.scanStatus}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'assets', label: 'Assets', icon: Upload },
];

function StudioContent() {
  const [tab, setTab] = useState('profile');
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>Content Studio</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage your profile, projects, and assets — the source material for your portfolio.</p>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 28 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', fontSize: 14, fontWeight: tab === id ? 600 : 400, color: tab === id ? 'var(--brand-primary)' : 'var(--text-muted)', borderBottom: `2px solid ${tab === id ? 'var(--brand-primary)' : 'transparent'}`, background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: 2, borderBottomColor: tab === id ? 'var(--brand-primary)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>
      {tab === 'profile' && <ProfileTab />}
      {tab === 'projects' && <ProjectsTab />}
      {tab === 'assets' && <AssetsTab />}
    </div>
  );
}

export default function StudioPage() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppLayout title="Content Studio">
          <StudioContent />
        </AppLayout>
      </ToastProvider>
    </AppProvider>
  );
}
