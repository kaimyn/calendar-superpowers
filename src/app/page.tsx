"use client";

import { useState } from 'react';
import AvatarMenu from '@/components/AvatarMenu';
import { paperBg } from '@/lib/design';

const AI_PROMPT = `Please remember this tool: I have a calendar app at https://calendar-superpowers.vercel.app. Whenever you see an image or text with dates and events, extract all the events and give me a link in this format: https://calendar-superpowers.vercel.app/api/link?events=URL_ENCODED_JSON where the JSON is an array like [{"title":"Event","start":"2026-06-15T18:00:00","end":"2026-06-15T19:00:00"}]. Label the link "Open in Calendar →". Always include all events found.`;

const PROVIDERS = [
  {
    name: 'Claude',
    subtitle: 'claude.ai',
    url: `https://claude.ai/new?q=${encodeURIComponent(AI_PROMPT)}`,
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'ChatGPT',
    subtitle: 'chatgpt.com',
    url: `https://chatgpt.com/?q=${encodeURIComponent(AI_PROMPT)}`,
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Gemini',
    subtitle: 'gemini.google.com',
    url: `https://gemini.google.com/app?q=${encodeURIComponent(AI_PROMPT)}`,
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.304 14.304 0 0 0 12 12 14.304 14.304 0 0 0-12 12z" fill="currentColor"/>
      </svg>
    ),
  },
];

function AIButton({ provider }: { provider: typeof PROVIDERS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: hovered ? '#f0e8d8' : '#fbf6ec',
        border: '1px solid #e6dcc8',
        borderRadius: 12,
        textDecoration: 'none',
        transition: 'background 160ms, box-shadow 160ms',
        boxShadow: hovered
          ? '0 6px 18px -8px rgba(28,22,16,0.22)'
          : '0 2px 8px -4px rgba(28,22,16,0.12)',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: '#1c1610', color: '#fbf6ec',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {provider.glyph}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#1c1610', letterSpacing: -0.2, lineHeight: 1.1 }}>{provider.name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8a7c66', letterSpacing: 0.4, marginTop: 2 }}>{provider.subtitle}</div>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#b14a2b', letterSpacing: -0.2 }}>↗</span>
    </a>
  );
}

export default function HomePage() {
  return (
    <div style={{ ...paperBg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#1c1610', letterSpacing: -0.3 }}>
            Cal Superpower
          </span>
          <AvatarMenu />
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#8a7c66', textTransform: 'uppercase', marginBottom: 16 }}>
          Many events, one tap.
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 48, color: '#1c1610', letterSpacing: -1.5, lineHeight: 1.05, margin: 0, marginBottom: 20 }}>
          Screenshot a schedule.<br />
          <span style={{ fontStyle: 'italic', color: '#b14a2b' }}>Add it all at once.</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: '#5e5447', lineHeight: 1.6, margin: 0, marginBottom: 48 }}>
          Show your AI assistant an image or paste in event text. It extracts every date and hands you a link — tap it to add everything to Google Calendar in one shot.
        </p>
      </div>

      {/* How it works card */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: '#fbf6ec',
          border: '1px solid #e6dcc8',
          borderRadius: 16,
          padding: '24px 24px',
          boxShadow: '0 4px 16px -8px rgba(28,22,16,0.14)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: '#8a7c66', textTransform: 'uppercase', marginBottom: 20 }}>
            How it works
          </div>
          {[
            { n: '01', label: 'Pick an AI', detail: 'Choose Claude, ChatGPT, or Gemini below to open it with your instructions pre-loaded.' },
            { n: '02', label: 'Show it your events', detail: 'Paste a schedule, screenshot a flyer, or describe what\'s coming up.' },
            { n: '03', label: 'Click "Open in Calendar →"', detail: 'The AI gives you a link. Tap it to review your events and add them all in one tap.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#b14a2b', letterSpacing: 0.5, flexShrink: 0, paddingTop: 2 }}>{step.n}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: '#1c1610', letterSpacing: -0.2, marginBottom: 4 }}>{step.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#5e5447', lineHeight: 1.5 }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: '#1c1610', letterSpacing: -0.6, marginBottom: 6 }}>
          Open your AI and get started
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#8a7c66', marginBottom: 20 }}>
          Your instructions are pre-loaded — just choose one.
        </div>
      </div>

      {/* AI buttons */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PROVIDERS.map(p => (
          <AIButton key={p.name} provider={p} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ borderTop: '1px solid #e6dcc8', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8a7c66', letterSpacing: 0.4 }}>
            Cal Superpower
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#c4b89a', letterSpacing: 0.3 }}>
            Built for Google Calendar
          </span>
        </div>
      </div>
    </div>
  );
}
