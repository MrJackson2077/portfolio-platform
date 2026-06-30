import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: 'YourWork — AI-Assisted Portfolio Builder', template: '%s | YourWork' },
  description: 'Build a credible, beautiful portfolio in minutes. Upload your materials, let AI draft the content, refine it, and publish.',
  keywords: ['portfolio', 'AI', 'career', 'resume', 'builder'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
