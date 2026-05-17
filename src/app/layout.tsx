import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Geist } from 'next/font/google';
import "./globals.css";

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Cal Superpower",
  description: "Many events, one tap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable} ${sans.variable} h-full antialiased`}
      style={{ background: '#f5efe2' }}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
