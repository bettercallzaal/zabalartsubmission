'use client';

// Countdown to the next Sunday midnight in America/New_York - when the
// current ZABAL voting week closes and the spotlight winner is computed.
// Tiny, dependency-free, updates once per minute (no rAF needed).

import { useEffect, useState } from 'react';

function msUntilSundayMidnightNY(): number {
  // Build a Date that is "now in New York" via formatToParts, then walk
  // forward to the next Sunday 00:00 NY time. Returns ms-from-real-now.
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const weekdayShort = parts.weekday; // Sun..Sat
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = map[weekdayShort] ?? 0;
  // days until next Sunday (1..7; if currently Sunday and past midnight, that's already past, target NEXT)
  let daysToSun = (7 - dow) % 7;
  // If it IS Sunday and the local time is past 00:00, days = 7
  if (dow === 0) daysToSun = 7;
  const targetMidnightNyMs =
    Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      // NY-local 00:00 next-target Sunday represented as UTC. We don't
      // know the offset exactly without a DST lookup, so cheat: build a
      // local-formatted date string + parse it as NY time via Date roundtrip.
      0, 0, 0,
    ) + daysToSun * 24 * 60 * 60 * 1000;
  // Correct for NY offset by re-formatting the target back to NY and
  // adjusting until the NY hour reads 00. Single iteration is enough
  // because the offset is +/- 5h, then +/- 4h during DST.
  let target = new Date(targetMidnightNyMs);
  for (let i = 0; i < 2; i++) {
    const hourInNy = Number(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        hour12: false,
      }).format(target).replace(/\D/g, ''),
    );
    if (hourInNy === 0) break;
    // adjust by the offset to land on 00
    target = new Date(target.getTime() + ((24 - hourInNy) % 24) * 60 * 60 * 1000);
  }
  return target.getTime() - now.getTime();
}

function fmtRemaining(ms: number): string {
  if (ms <= 0) return 'closing';
  const totalMin = Math.floor(ms / 60_000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function Countdown() {
  const [remaining, setRemaining] = useState<string>('…');
  useEffect(() => {
    const tick = () => setRemaining(fmtRemaining(msUntilSundayMidnightNY()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{remaining}</span>
  );
}
