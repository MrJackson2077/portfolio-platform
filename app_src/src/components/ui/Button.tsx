'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'btn';
  const v = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' }[variant];
  const s = { sm: 'btn-sm', md: '', lg: 'btn-lg', icon: 'btn-icon' }[size];
  return (
    <button className={`${base} ${v} ${s} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className="spinner" style={{ width: 16, height: 16 }} />}
      {children}
    </button>
  );
}
