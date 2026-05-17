"use client";

import { season } from '@/lib/design';

type RibbonEvent = { id: string; startISO: string; endISO: string; multiDay: boolean };
type Props = { events: RibbonEvent[]; selected: Set<string>; activeId: string | null; onTap: (id: string) => void };

const MONTHS_LABELS = ['S','O','N','D','J','F','M','A','M','J','J','A'];

export default function MobileRibbon({ events, selected, activeId, onTap }: Props) {
  // Academic year Sep→Aug, derived from events
  const dates = events.map(e => new Date(e.startISO));
  const minYear = dates.reduce((min, d) => d < min ? d : min, dates[0] ?? new Date()).getFullYear();
  const sepYear = dates.some(d => d.getMonth() >= 8) ? minYear : minYear - 1;
  const YEAR_START = new Date(sepYear, 8, 1).getTime();
  const YEAR_END = new Date(sepYear + 1, 7, 31).getTime();
  const pct = (iso: string) => Math.min(100, Math.max(0, ((new Date(iso).getTime() - YEAR_START) / (YEAR_END - YEAR_START)) * 100));

  return (
    <div style={{ padding: '0 2px' }}>
      {/* Month axis */}
      <div style={{ position: 'relative', height: 22 }}>
        {MONTHS_LABELS.map((m, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(i / 12) * 100}%`, top: 0, bottom: 0, borderLeft: i === 0 ? 'none' : '1px solid #e6dcc8', paddingLeft: 3, paddingTop: 2, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 0.8, color: i === 4 ? '#b14a2b' : '#8a7c66' }}>
            {m}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 1, background: '#2a221b' }} />
      </div>
      {/* Pins */}
      <div style={{ position: 'relative', height: 42, marginTop: 4 }}>
        {events.map((e, idx) => {
          const isSel = selected.has(e.id);
          const isActive = activeId === e.id;
          const c = season(e.startISO);
          const left = pct(e.startISO);
          const width = e.multiDay ? pct(e.endISO) - left : 0;
          return (
            <div key={e.id} onClick={ev => { ev.stopPropagation(); onTap(e.id); }} style={{ position: 'absolute', left: `${left}%`, top: (idx % 2) * 20, width: e.multiDay ? `${width}%` : 'auto', cursor: 'pointer' }}>
              {e.multiDay ? (
                <div style={{ height: 10, background: isSel ? c.band : `${c.band}30`, border: isSel ? 'none' : `1px solid ${c.band}`, borderRadius: 999, transform: isActive ? 'scaleY(1.4)' : 'scaleY(1)', transition: 'all 200ms' }} />
              ) : (
                <div style={{ width: 10, height: 10, background: isSel ? c.band : '#fbf6ec', border: `1.5px solid ${c.band}`, borderRadius: '50%', transform: isActive ? 'scale(1.5)' : 'scale(1)', transition: 'all 200ms' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
