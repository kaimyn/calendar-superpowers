"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { decodeEvents } from '@/lib/schema';
import { isMultiDay, paperBg } from '@/lib/design';
import MobileCard from '@/components/MobileCard';
import MobileRibbon from '@/components/MobileRibbon';
import TopBar from '@/components/TopBar';

type DesignEvent = {
  id: string;
  title: string;
  startISO: string;
  endISO: string;
  multiDay: boolean;
  // original fields for API
  start: string;
  end?: string;
};

type ResultItem = { title: string; ok: boolean; link?: string; error?: string };

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [screen, setScreen] = useState<'review' | 'loading' | 'success' | 'fail'>('review');
  const [events, setEvents] = useState<DesignEvent[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmedEvents, setConfirmedEvents] = useState<DesignEvent[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) return;
    const decoded = decodeEvents(data);
    const designEvents: DesignEvent[] = decoded
      .map((e, i) => ({
        id: i.toString(),
        title: e.title,
        startISO: e.start,
        endISO: e.end ?? e.start,
        multiDay: isMultiDay(e.start, e.end),
        start: e.start,
        end: e.end,
      }))
      .sort((a, b) => a.startISO.localeCompare(b.startISO));
    setEvents(designEvents);
    setSelected(new Set(designEvents.map(e => e.id)));
  }, [searchParams]);

  const handleRibbonTap = useCallback((id: string) => {
    setActiveId(id);
    setTimeout(() => setActiveId(null), 1400);

    // Scroll to card manually
    if (scrollRef.current) {
      const card = cardRefs.current.get(id);
      if (card) {
        const containerTop = scrollRef.current.getBoundingClientRect().top;
        const cardTop = card.getBoundingClientRect().top;
        const currentScroll = scrollRef.current.scrollTop;
        const target = currentScroll + (cardTop - containerTop) - 24;
        scrollRef.current.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  }, []);

  const toggleEvent = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleConfirm = async () => {
    const toAdd = events.filter(e => selected.has(e.id));
    setConfirmedEvents(toAdd);
    setScreen('loading');

    try {
      const res = await fetch('/api/calendar/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: toAdd.map(e => ({ title: e.title, start: e.start, end: e.end })),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (res.status === 401) {
        window.location.href = `/api/auth/reauth?callbackUrl=${encodeURIComponent(window.location.href)}`;
        return;
      }

      const json = await res.json();
      setResults(json.results ?? []);
      setScreen('success');
    } catch {
      setScreen('fail');
    }
  };

  // Empty state
  if (events.length === 0 && screen === 'review') {
    return (
      <div style={{ ...paperBg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: '#1c1610', letterSpacing: -0.4 }}>No events found</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#8a7c66', marginTop: 8 }}>The link may be malformed or expired.</div>
        </div>
      </div>
    );
  }

  // LOADING screen
  if (screen === 'loading') {
    return (
      <div style={{ ...paperBg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{
          width: 52, height: 52,
          border: '3px solid #e6dcc8',
          borderTopColor: '#b14a2b',
          borderRadius: '50%',
          animation: 'spinE 0.9s linear infinite',
        }} />
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#1c1610', letterSpacing: -0.3 }}>
          Adding {confirmedEvents.length} event{confirmedEvents.length !== 1 ? 's' : ''}…
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8a7c66', letterSpacing: 0.8 }}>
          Talking to Google Calendar
        </div>
      </div>
    );
  }

  // SUCCESS screen
  if (screen === 'success') {
    const allOk = results.every(r => r.ok);
    return (
      <div style={{ ...paperBg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '20px 24px 0' }}>
          <TopBar showLeft={false} />
        </div>
        <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '0 24px', flex: 1 }}>
          {/* Wobbly checkmark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, paddingBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: allOk ? '#3d6048' : '#b14a2b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'wobbleE 500ms ease-out forwards',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32">
                {allOk
                  ? <path d="M8 16L14 22L24 10" stroke="#dceadd" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M10 10L22 22M22 10L10 22" stroke="#fbeadf" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                }
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: '#1c1610', letterSpacing: -0.6, marginTop: 20 }}>
              {allOk ? 'All added!' : 'Some events failed'}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#8a7c66', marginTop: 6 }}>
              {results.filter(r => r.ok).length} of {results.length} added to your calendar
            </div>
          </div>

          {/* Receipt */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r, i) => (
              <div key={i} style={{
                background: '#fbf6ec',
                border: `1px solid ${r.ok ? '#c8d9ca' : '#e6c4b8'}`,
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 8px -4px rgba(28,22,16,0.10)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: r.ok ? '#3d6048' : '#b14a2b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  animation: 'popInE 300ms ease-out forwards',
                }}>
                  <svg width="12" height="12" viewBox="0 0 14 14">
                    {r.ok
                      ? <path d="M3 7L6 10L11 4" stroke="#dceadd" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M4 4L10 10M10 4L4 10" stroke="#fbeadf" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    }
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: '#1c1610', letterSpacing: -0.2 }}>{r.title}</div>
                  {!r.ok && r.error && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#b14a2b', letterSpacing: 0.3, marginTop: 3 }}>{r.error}</div>
                  )}
                </div>
                {r.ok && r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#b14a2b', letterSpacing: 0.4, textDecoration: 'none', flexShrink: 0 }}
                  >
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 28, paddingBottom: 40, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/')}
              style={{ all: 'unset' as const, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8a7c66', letterSpacing: 0.6 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FAIL screen
  if (screen === 'fail') {
    return (
      <div style={{ ...paperBg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#b14a2b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'wobbleE 500ms ease-out forwards',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M10 10L22 22M22 10L10 22" stroke="#fbeadf" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: '#1c1610', letterSpacing: -0.5, textAlign: 'center' }}>
          Something went wrong
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#8a7c66', textAlign: 'center' }}>
          Please try again.
        </div>
        <button
          onClick={() => setScreen('review')}
          style={{
            all: 'unset' as const, cursor: 'pointer',
            marginTop: 16,
            padding: '12px 28px',
            background: '#1c1610', color: '#fbf6ec',
            borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 0.6,
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  // REVIEW screen
  const selCount = selected.size;

  return (
    <div style={{ ...paperBg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Fixed header */}
      <div style={{ flexShrink: 0, padding: '20px 20px 0' }}>
        <TopBar showLeft={false} />

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: '#1c1610', letterSpacing: -0.8, lineHeight: 1.1, marginTop: 20, marginBottom: 16 }}>
          Add these to your<br />
          <span style={{ fontStyle: 'italic', color: '#b14a2b' }}>calendar.</span>
        </div>

        {/* Ribbon */}
        <MobileRibbon
          events={events.map(e => ({ id: e.id, startISO: e.startISO, endISO: e.endISO, multiDay: e.multiDay }))}
          selected={selected}
          activeId={activeId}
          onTap={handleRibbonTap}
        />

        {/* Count + controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#1c1610', letterSpacing: -0.3 }}>
            {selCount} of {events.length} selected
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setSelected(new Set(events.map(e => e.id)))}
              style={{ all: 'unset' as const, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5e5447', letterSpacing: 0.5 }}
            >
              All
            </button>
            <button
              onClick={() => setSelected(new Set())}
              style={{ all: 'unset' as const, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5e5447', letterSpacing: 0.5 }}
            >
              None
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable card list */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4, paddingBottom: 120 }}>
          {events.map(event => (
            <MobileCard
              key={event.id}
              event={event}
              selected={selected.has(event.id)}
              active={activeId === event.id}
              onToggle={() => toggleEvent(event.id)}
              refCb={(node) => {
                if (node) cardRefs.current.set(event.id, node);
                else cardRefs.current.delete(event.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 28px',
        background: 'linear-gradient(to top, #f5efe2 70%, transparent)',
      }}>
        <button
          onClick={handleConfirm}
          disabled={selCount === 0}
          style={{
            all: 'unset' as const,
            cursor: selCount === 0 ? 'not-allowed' : 'pointer',
            display: 'block', width: '100%', boxSizing: 'border-box',
            background: selCount === 0 ? '#c4b89a' : '#1c1610',
            color: '#fbf6ec',
            borderRadius: 14, padding: '16px 20px',
            fontFamily: 'var(--font-serif)', fontSize: 19, letterSpacing: -0.3,
            textAlign: 'center',
            boxShadow: selCount === 0 ? 'none' : '0 8px 20px -8px rgba(28,22,16,0.4)',
            transition: 'background 200ms, box-shadow 200ms',
          }}
        >
          Add {selCount} event{selCount !== 1 ? 's' : ''} to Google Calendar
        </button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense>
      <EventsContent />
    </Suspense>
  );
}
