// Past 4 weeks sparkline - shows mode winners and win percentages
// of the most recent 4 completed weeks, oldest-first. Builds momentum
// signal ("Music has won 3 of last 4") that anchors the weekly
// rhythm. (Research Doc 733, ranked action #14.)
//
// Server component. Renders nothing if the RPC errors (pre-migration)
// or if there are no completed weeks yet.

import { supabaseAdmin } from '@/lib/db/supabase';

interface WinnerRow {
  week: string;        // ISO date
  mode: string;
  vote_count: number;
  total_power: number;
  win_pct: number;
}

const MODE_LABEL: Record<string, string> = {
  music: 'Music',
  governance: 'Gov',
  events: 'Events',
  build: 'Build',
};

const MODE_COLOR: Record<string, string> = {
  music: '#f472b6',     // pink
  governance: '#60a5fa', // blue
  events: '#fb923c',     // orange
  build: '#22c55e',      // green
};

function formatWeekLabel(isoDate: string): string {
  // ISO YYYY-MM-DD -> Mon DD (e.g. "May 12")
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

async function getPast4Weeks(): Promise<WinnerRow[]> {
  const { data, error } = await supabaseAdmin.rpc('get_zabal_4week_winners');
  if (error || !data) return [];
  return data as WinnerRow[];
}

export async function Past4WeeksSparkline() {
  const weeks = await getPast4Weeks();
  if (weeks.length === 0) return null;

  return (
    <section
      style={{ padding: '0 2rem 1rem', maxWidth: 960, margin: '0 auto' }}
    >
      <h3
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#a0a0a0',
          margin: '0 0 0.6rem',
        }}
      >
        Last {weeks.length} weeks
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gap: '0.5rem',
        }}
      >
        {weeks.map((w) => {
          const label = MODE_LABEL[w.mode] ?? w.mode;
          const color = MODE_COLOR[w.mode] ?? '#e0ddaa';
          return (
            <div
              key={w.week}
              title={`${formatWeekLabel(w.week)} - ${label} won ${w.win_pct}% (${w.vote_count} votes, ${w.total_power} power)`}
              style={{
                background: 'rgba(20, 30, 39, 0.6)',
                border: '1px solid rgba(224, 221, 170, 0.15)',
                borderRadius: 8,
                padding: '0.6rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Subtle background bar showing win pct */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top, ${color}22 0%, ${color}22 ${w.win_pct}%, transparent ${w.win_pct}%)`,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  fontSize: '0.7rem',
                  color: '#666',
                  letterSpacing: '0.04em',
                }}
              >
                {formatWeekLabel(w.week)}
              </div>
              <div
                style={{
                  position: 'relative',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color,
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  position: 'relative',
                  fontSize: '0.7rem',
                  color: '#a0a0a0',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {`${w.win_pct}%`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
