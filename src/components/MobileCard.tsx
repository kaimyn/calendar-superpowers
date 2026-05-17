"use client";

import { season, ordinal, fmtWeekday, fmtMonth, fmtDay, fmtTime } from '@/lib/design';

type CardEvent = { id: string; title: string; startISO: string; endISO: string; multiDay: boolean };
type Props = { event: CardEvent; selected: boolean; active: boolean; onToggle: () => void; refCb: (node: HTMLButtonElement | null) => void };

export default function MobileCard({ event, selected, active, onToggle, refCb }: Props) {
  const c = season(event.startISO);
  const shadow = selected
    ? `0 0 0 2px ${c.band}, 0 12px 26px -12px rgba(28,22,16,0.28), 0 2px 6px -3px rgba(28,22,16,0.14)`
    : active
    ? `0 0 0 1.5px ${c.band}80, 0 8px 20px -10px rgba(28,22,16,0.22)`
    : '0 8px 20px -12px rgba(28,22,16,0.18), 0 1px 4px -2px rgba(28,22,16,0.1)';

  return (
    <button
      ref={refCb}
      onClick={onToggle}
      style={{ all: 'unset' as const, cursor: 'pointer', background: '#fbf6ec', borderRadius: 14, overflow: 'hidden', boxShadow: shadow, display: 'block', width: '100%', scrollMarginTop: 24, transition: 'box-shadow 220ms ease, transform 220ms ease', transform: selected ? 'translateY(-1px)' : 'translateY(0)' }}
    >
      {/* Band */}
      <div style={{ background: c.band, color: c.ink, padding: '11px 16px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase' }}>
          {fmtWeekday(event.startISO)}, {fmtMonth(event.startISO)}
        </span>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: selected ? c.ink : 'transparent', border: selected ? 'none' : `1.5px solid ${c.ink}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 180ms' }}>
          {selected && (
            <svg width="11" height="11" viewBox="0 0 14 14">
              <path d="M3 7L6 10L11 4" stroke={c.band} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div style={{ position: 'absolute', left: '30%', bottom: -5, width: 8, height: 8, borderRadius: '50%', background: '#fbf6ec' }} />
        <div style={{ position: 'absolute', right: '30%', bottom: -5, width: 8, height: 8, borderRadius: '50%', background: '#fbf6ec' }} />
      </div>
      {/* Body */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', gap: 18, alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 58, fontWeight: 400, letterSpacing: -2.2, color: '#1c1610', lineHeight: 0.85, flexShrink: 0 }}>
          {ordinal(fmtDay(event.startISO))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#1c1610', letterSpacing: -0.3, lineHeight: 1.1 }}>{event.title}</div>
          {event.multiDay ? (
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: '#5e5447', marginTop: 6, letterSpacing: -0.1 }}>
              Until {fmtWeekday(event.endISO)}, {fmtMonth(event.endISO)} {ordinal(fmtDay(event.endISO))}
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.6, color: '#8a7c66', textTransform: 'uppercase', marginTop: 8 }}>
              {event.startISO.includes('T') ? `${fmtTime(event.startISO)} — ${fmtTime(event.endISO)}` : 'All day'}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
