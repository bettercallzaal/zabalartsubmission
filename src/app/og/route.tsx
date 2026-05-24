import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/db/supabase';

// OG / Mini App embed image for the ZABAL hub. Referenced by the
// per-route fc:miniapp embed in src/app/page.tsx (Research Doc 707/708).
//
// Dynamic: pulls this week's mode totals and renders horizontal bars
// so every share-cast preview card shows the live tally. Falls back
// to a static identity card if Supabase is unreachable or there's no
// votes this week yet.
//
// Cached for 60s via `revalidate` - one DB roundtrip per minute even
// if a viral cast generates thousands of preview hits.

export const runtime = 'nodejs'; // supabaseAdmin uses Node APIs
export const revalidate = 60;
export const contentType = 'image/png';
export const size = { width: 1200, height: 800 };

interface ModeTotal {
  mode: string;
  vote_count: number;
  total_power: number;
}

const MODES: Array<{ id: string; label: string; icon: string }> = [
  { id: 'music', label: 'Music', icon: '♫' },
  { id: 'governance', label: 'Governance', icon: '⚖' },
  { id: 'events', label: 'Events', icon: '●' },
  { id: 'build', label: 'Build', icon: '⛏' },
];

async function fetchTotals(): Promise<ModeTotal[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_this_zabal_weeks_votes');
    if (error || !data) return [];
    return data as ModeTotal[];
  } catch {
    return [];
  }
}

export async function GET() {
  const totals = await fetchTotals();
  const totalPower = totals.reduce((s, t) => s + Number(t.total_power || 0), 0);
  const rows = MODES.map((m) => {
    const t = totals.find((x) => x.mode === m.id);
    const power = t ? Number(t.total_power) : 0;
    const pct = totalPower > 0 ? Math.round((power / totalPower) * 100) : 0;
    return { ...m, power, pct };
  });
  const hasVotes = totalPower > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(circle at 50% 10%, rgba(224,221,170,0.18), transparent 55%), linear-gradient(135deg, #0a0a0a 0%, #141e27 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: '60px 80px',
        }}
      >
        {/* Header - identity */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: 10,
              background: 'linear-gradient(135deg, #ffffff 0%, #e0ddaa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            ZABAL
          </div>
          <div style={{ fontSize: 24, color: '#a0a0a0', letterSpacing: 2 }}>zabal.art</div>
        </div>

        <div style={{ fontSize: 30, color: '#e0ddaa', marginTop: 8, fontWeight: 700 }}>
          {hasVotes ? 'This week on ZAO' : 'Vote weekly on ZAO direction'}
        </div>

        {/* Mode rows - bars with live percentages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 36 }}>
          {rows.map((r) => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: 260,
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                <span style={{ fontSize: 36, color: '#e0ddaa' }}>{r.icon}</span>
                <span>{r.label}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  height: 36,
                  background: 'rgba(20, 30, 39, 0.7)',
                  border: '1px solid rgba(224, 221, 170, 0.2)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(r.pct, hasVotes ? 2 : 0)}%`,
                    background: 'linear-gradient(90deg, #e0ddaa 0%, rgba(224, 221, 170, 0.4) 100%)',
                    display: 'flex',
                  }}
                />
              </div>
              <div
                style={{
                  width: 100,
                  textAlign: 'right',
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#e0ddaa',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {r.pct}%
              </div>
            </div>
          ))}
        </div>

        {/* Footer - call to action */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(224, 221, 170, 0.18)',
          }}
        >
          <div style={{ fontSize: 22, color: '#a0a0a0' }}>
            {hasVotes ? `${totalPower} power cast this week` : 'Be the first to vote this week'}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#0a0a0a',
              background: '#e0ddaa',
              borderRadius: 999,
              padding: '12px 28px',
            }}
          >
            Tap to vote -&gt;
          </div>
        </div>
      </div>
    ),
    size,
  );
}
