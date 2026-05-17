"use client";

import { useEffect, useRef, useState } from 'react';

type Props = { onSignOut?: () => void };

export default function AvatarMenu({ onSignOut }: Props) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (d?.user) setUser(d.user);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const name = user?.name ?? '';
  const email = user?.email ?? '';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase() || '·';

  const handleSignOut = async () => {
    setOpen(false);
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
    onSignOut?.();
  };

  const avatarStyle: React.CSSProperties = {
    all: 'unset' as const,
    cursor: 'pointer',
    width: 34, height: 34, borderRadius: '50%',
    background: '#1c1610', color: '#fbf6ec',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1,
    boxShadow: open ? '0 0 0 3px rgba(177,74,43,0.25)' : '0 1px 3px rgba(28,22,16,0.18)',
    transition: 'box-shadow 180ms', flexShrink: 0,
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={avatarStyle}>{initials}</button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 42, width: 220,
          background: '#fbf6ec', border: '1px solid #e6dcc8', borderRadius: 10,
          padding: '12px 0 6px',
          boxShadow: '0 14px 36px -12px rgba(28,22,16,0.32), 0 4px 12px -6px rgba(28,22,16,0.14)',
          zIndex: 30, animation: 'fadeInDownE 160ms ease-out',
        }}>
          <div style={{ padding: '4px 14px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1c1610', color: '#fbf6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.8, flexShrink: 0 }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: '#1c1610', letterSpacing: -0.2, lineHeight: 1.1 }}>{name || 'Signed in'}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8a7c66', letterSpacing: 0.2, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e6dcc8' }} />
          <button
            onClick={handleSignOut}
            style={{ all: 'unset' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontFamily: 'var(--font-sans)', fontSize: 13, color: '#1c1610', transition: 'background 140ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(177,74,43,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span>Sign out</span>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5.5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2.5M9 4.5L11.5 7L9 9.5M11 7H5" stroke="#5e5447" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
