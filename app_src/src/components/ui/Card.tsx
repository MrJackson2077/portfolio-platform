'use client';
import React from 'react';

interface BadgeProps { variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode; className?: string; }

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

interface CardProps { children: React.ReactNode; className?: string; glass?: boolean; gradient?: boolean; onClick?: () => void; }

export function Card({ children, className = '', glass, gradient, onClick }: CardProps) {
  const base = glass ? 'card-glass' : gradient ? 'gradient-border' : 'card';
  return (
    <div className={`${base} ${className}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {children}
    </div>
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} />;
}

interface ProgressProps { value: number; className?: string; }
export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
