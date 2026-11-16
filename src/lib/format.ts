const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** "2026-02" → "Feb 2026". */
export function formatMonth(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  const month = m ? Number(m[2]) : 0;
  if (!m || month < 1 || month > 12) throw new Error(`Bad month: ${ym}`);
  return `${MONTHS[month - 1]} ${m[1]}`;
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} → ${end === null ? 'now' : formatMonth(end)}`;
}

