import type { CSSProperties } from 'react';

export const season = (iso: string): { band: string; ink: string } => {
  const m = new Date(iso).getMonth();
  if ([11, 0, 1].includes(m)) return { band: '#1c2e4a', ink: '#d6e1f4' };
  if ([2, 3, 4].includes(m))  return { band: '#3d6048', ink: '#dceadd' };
  if ([5, 6, 7].includes(m))  return { band: '#b14a2b', ink: '#fbeadf' };
  return { band: '#7a5a2e', ink: '#f0e3cc' };
};

export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const WEEKDAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const parseLocalDate = (iso: string): Date => {
  if (!iso.includes('T')) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(iso);
};

export const fmtWeekday = (iso: string) => WEEKDAYS[parseLocalDate(iso).getDay()];
export const fmtMonth = (iso: string) => MONTHS_SHORT[parseLocalDate(iso).getMonth()];
export const fmtDay = (iso: string) => parseLocalDate(iso).getDate();
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00', '');

export const isMultiDay = (start: string, end?: string): boolean => {
  if (!end) return false;
  return start.split('T')[0] !== end.split('T')[0];
};

export const paperBg: CSSProperties = {
  background: '#f5efe2',
  backgroundImage:
    'radial-gradient(circle at 10% 0%, rgba(177,74,43,0.07), transparent 40%), radial-gradient(circle at 100% 100%, rgba(28,46,74,0.05), transparent 40%)',
};
