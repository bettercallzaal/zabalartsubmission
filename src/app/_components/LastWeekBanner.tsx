// Server component - thin strip above vote cards anchoring the
// week-over-week story ("Last week: Music won 47%"). Gracefully
// renders nothing if the RPC is missing (pre-migration) or last
// week had zero votes.

import { supabaseAdmin } from '@/lib/db/supabase';

interface WinnerRow {
  week: string;          // ISO date (YYYY-MM-DD)
  mode: string;
  vote_count: number;
  total_power: number;
  win_pct: number;
}

const MODE_LABEL: Record<string, string> = {
  music: 'Music',
  governance: 'Governance',
  events: 'Events',
  build: 'Build',
};

const MODE_ICON: Record<string, string> = {
  music: '♫',     // beamed eighth notes
  governance: '⚖', // scales
  events: '●',     // black circle
  build: '⛏',      // pick
};

async function getLastWeekWinner(): Promise<WinnerRow | null> {
  // If the RPC doesn't exist yet (migration not run), the call returns
  // an error - we swallow it so the page still renders.
  const { data, error } = await supabaseAdmin.rpc('get_zabal_last_weeks_winner');
  if (error || !data) return null;
  const rows = data as WinnerRow[];
  if (rows.length === 0) return null;
  return rows[0];
}

export async function LastWeekBanner() {
  const winner = await getLastWeekWinner();
  if (!winner) return null;

  const label = MODE_LABEL[winner.mode] ?? winner.mode;
  const icon = MODE_ICON[winner.mode] ?? '';

  return (
    <section
      style={{
        maxWidth: 960,
        margin: '0 auto 1rem',
        padding: '0 2rem',
      }}
    >
      <div
        style={{
          background:
            'linear-gradient(90deg, rgba(224, 221, 170, 0.12), rgba(224, 221, 170, 0.02))',
          border: '1px solid rgba(224, 221, 170, 0.25)',
          borderRadius: 12,
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          fontSize: '0.9rem',
          color: '#e0ddaa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a0a0a0',
              border: '1px solid rgba(224, 221, 170, 0.25)',
              borderRadius: 999,
              padding: '2px 8px',
            }}
          >
            Last week
          </span>
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <strong style={{ color: '#fff' }}>{label}</strong>
          <span style={{ color: '#a0a0a0' }}>won</span>
          <strong style={{ color: '#e0ddaa' }}>{winner.win_pct}%</strong>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>
            ({winner.vote_count} votes, {winner.total_power} power)
          </span>
        </div>
        <span style={{ color: '#a0a0a0', fontSize: '0.8rem' }}>
          New week, new vote -&gt;
        </span>
      </div>
    </section>
  );
}
