'use client';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Sidebar } from './Sidebar';
import { AppTopBar } from './AppTopBar';
import '@/styles/globals.css';

export function AppLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <AppProvider>
      <ToastProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <AppTopBar title={title} />
            <div className="page-content">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </AppProvider>
  );
}
