'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; }
interface ToastContextValue { toast: (message: string, type?: Toast['type']) => void; }
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: <CheckCircle size={18} color="var(--success)" />, error: <AlertCircle size={18} color="var(--error)" />, warning: <AlertTriangle size={18} color="var(--warning)" />, info: <Info size={18} color="var(--brand-primary)" /> };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {icons[t.type]}
            <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{ color: 'var(--text-muted)', display: 'flex', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx.toast;
}
