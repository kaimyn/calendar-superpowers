"use client";

import AvatarMenu from './AvatarMenu';

type Props = { leftLabel?: string; onLeft?: () => void; showLeft?: boolean };

export default function TopBar({ leftLabel = 'Back', onLeft, showLeft = true }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
      {showLeft ? (
        <button onClick={onLeft} style={{ all: 'unset' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5e5447', letterSpacing: 0.4 }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>‹</span> {leftLabel}
        </button>
      ) : <div />}
      <AvatarMenu />
    </div>
  );
}
