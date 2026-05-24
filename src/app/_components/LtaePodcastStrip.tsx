// Let's Talk About Ethereum (LTAE) podcast strip.
//
// LTAE is Zaal's weekly Twitch podcast - Wednesdays 6pm EST live on
// twitch.tv/bettercallzaal. Shows "LIVE NOW" when it's Wed 6-8pm ET,
// otherwise shows the next-Wednesday countdown. Pure client logic,
// no API call. (Research Doc 733, ranked action #19.)

'use client';

import { useEffect, useState } from 'react';

const LTAE_URL = 'https://twitch.tv/bettercallzaal';
// Wednesday = day index 3 in JS Date getDay() (Sun=0..Sat=6)
const SHOW_DAY = 3;
const SHOW_START_HOUR_ET = 18; // 6pm ET
const SHOW_END_HOUR_ET = 20;   // assume 2-hour show; live indicator window

function nowInNyParts(): { day: number; hour: number; minute: number; weekday: string } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    day: weekdayMap[parts.weekday] ?? 0,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: parts.weekday,
  };
}

function statusLabel(): { live: boolean; label: string } {
  const { day, hour } = nowInNyParts();
  if (day === SHOW_DAY && hour >= SHOW_START_HOUR_ET && hour < SHOW_END_HOUR_ET) {
    return { live: true, label: 'LIVE NOW' };
  }
  // Days until next Wednesday 6pm ET
  let daysUntil = (SHOW_DAY - day + 7) % 7;
  // If today is Wed but past show window, push to next week
  if (daysUntil === 0 && hour >= SHOW_END_HOUR_ET) daysUntil = 7;
  if (daysUntil === 0 && hour < SHOW_START_HOUR_ET) {
    const hoursToStart = SHOW_START_HOUR_ET - hour;
    return { live: false, label: `Live in ${hoursToStart}h` };
  }
  if (daysUntil === 1) return { live: false, label: 'Live tomorrow 6pm ET' };
  return { live: false, label: `Live ${daysUntil}d - Wed 6pm ET` };
}

export function LtaePodcastStrip() {
  const [status, setStatus] = useState<{ live: boolean; label: string }>({
    live: false,
    label: 'Wed 6pm ET',
  });

  useEffect(() => {
    const tick = () => setStatus(statusLabel());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <a
      href={LTAE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap',
        background: status.live
          ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.16), rgba(20, 30, 39, 0.6) 60%)'
          : 'rgba(20, 30, 39, 0.6)',
        border: status.live
          ? '1px solid rgba(239, 68, 68, 0.5)'
          : '1px solid rgba(224, 221, 170, 0.2)',
        borderRadius: 12,
        padding: '0.75rem 1.25rem',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.9rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: status.live ? '#ef4444' : '#a0a0a0',
            animation: status.live ? 'ltaePulse 1.4s infinite' : 'none',
          }}
        />
        <strong style={{ color: status.live ? '#ef4444' : '#e0ddaa', letterSpacing: '0.04em' }}>
          {status.live ? 'LTAE LIVE NOW' : 'LTAE Podcast'}
        </strong>
        <span style={{ color: '#a0a0a0' }}>
          {status.live ? 'on Twitch -' : ''}{' '}
          {status.live ? "Let's Talk About Ethereum" : status.label}
        </span>
      </div>
      <span style={{ color: '#e0ddaa', fontWeight: 600 }}>
        twitch.tv/bettercallzaal -&gt;
      </span>
      <style>{`
        @keyframes ltaePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.25); }
        }
      `}</style>
    </a>
  );
}
