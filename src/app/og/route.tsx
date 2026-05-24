import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/db/supabase';

// OG / Mini App embed image for the ZABAL hub. Referenced by the
// per-route fc:miniapp embed in src/app/page.tsx.
//
// HYBRID: branches on ?mode=
// - With mode (music|governance|events|build): renders a static
//   identity card with that mode highlighted. No DB call. Cheap.
//   This is what share-casts from ZabalVoteClient embed (?mode=X).
// - Without mode: renders a dynamic tally card with 4 horizontal
//   bars showing live week percentages. One Supabase read per
//   cache-window. This is the bare zabal.art preview.
//
// Runtime is `nodejs` because supabaseAdmin needs Node APIs. The
// static mode-branch still works fine on Node, just doesn't hit DB.
// (Research Doc 733 + PR #6 + PR #8 reconciled in PR #10.)

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';
export const size = { width: 1200, height: 800 };

const MODE_IDS = ['music', 'governance', 'events', 'build'] as const;
type ModeId = (typeof MODE_IDS)[number];

const MODE_LABEL: Record<ModeId, string> = {
  music: 'Music',
  governance: 'Governance',
  events: 'Events',
  build: 'Build',
};

const MODE_ICON: Record<ModeId, string> = {
  music: '♫',
  governance: '⚖',
  events: '●',
  build: '⛏',
};

interface ModeTotal {
  mode: string;
  vote_count: number;
  total_power: number;
}

function parseMode(url: string): ModeId | null {
  try {
    const m = new URL(url).searchParams.get('mode')?.toLowerCase();
    if ((MODE_IDS as readonly string[]).includes(m ?? '')) {
      return m as ModeId;
    }
  } catch {
    // bad url - fall through
  }
  return null;
}

async function fetchTotals(): Promise<ModeTotal[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_this_zabal_weeks_votes');
    if (error || !data) return [];
    return data as ModeTotal[];
  } catch {
    return [];
  }
}

// ---------- variant 1: static mode-highlight (no DB) ----------

function renderModeCard(selected: ModeId) {
  const subtitle = `My pick: ${MODE_LABEL[selected]}`;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 50% 10%, rgba(224,221,170,0.18), transparent 55%), linear-gradient(135deg, #0a0a0a 0%, #141e27 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        padding: 80,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 160,
          fontWeight: 900,
          letterSpacing: 12,
          background: 'linear-gradient(135deg, #ffffff 0%, #e0ddaa 100%)',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        ZABAL
      </div>
      <div style={{ display: 'flex', fontSize: 40, color: '#e0ddaa', marginTop: 16, fontWeight: 700 }}>
        {subtitle}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 18,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 32,
        }}
      >
        {MODE_IDS.map((id) => {
          const isSelected = id === selected;
          return (
            <span
              key={id}
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                border: isSelected
                  ? '2px solid #e0ddaa'
                  : '1px solid rgba(224, 221, 170, 0.2)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(224, 221, 170, 0.25), rgba(224, 221, 170, 0.05))'
                  : 'rgba(20, 30, 39, 0.4)',
                color: isSelected ? '#ffffff' : '#a0a0a0',
                fontWeight: isSelected ? 700 : 500,
                fontSize: isSelected ? 34 : 28,
                letterSpacing: isSelected ? 1 : 0,
              }}
            >
              {MODE_LABEL[id]}
            </span>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          fontSize: 22,
          color: '#666',
          letterSpacing: 2,
        }}
      >
        zabal.art
      </div>
    </div>
  );
}

// ---------- variant 2: dynamic live-tally bars ----------

function renderTallyCard(rows: Array<{ id: ModeId; pct: number }>, totalPower: number) {
  const hasVotes = totalPower > 0;
  return (
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
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: '100%' }}>
        <div
          style={{
            display: 'flex',
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
        <div style={{ display: 'flex', fontSize: 24, color: '#a0a0a0', letterSpacing: 2 }}>zabal.art</div>
      </div>

      <div style={{ display: 'flex', fontSize: 30, color: '#e0ddaa', marginTop: 8, fontWeight: 700 }}>
        {hasVotes ? 'This week on ZAO' : 'Vote weekly on ZAO direction'}
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 36 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%' }}>
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
              <span style={{ display: 'flex', fontSize: 36, color: '#e0ddaa' }}>{MODE_ICON[r.id]}</span>
              <span style={{ display: 'flex' }}>{MODE_LABEL[r.id]}</span>
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
                  display: 'flex',
                  width: `${Math.max(r.pct, hasVotes ? 2 : 0)}%`,
                  background: 'linear-gradient(90deg, #e0ddaa 0%, rgba(224, 221, 170, 0.4) 100%)',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: 100,
                fontSize: 32,
                fontWeight: 700,
                color: '#e0ddaa',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {`${r.pct}%`}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
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
        <div style={{ display: 'flex', fontSize: 22, color: '#a0a0a0' }}>
          {hasVotes ? `${totalPower} power cast this week` : 'Be the first to vote this week'}
        </div>
        <div
          style={{
            display: 'flex',
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
  );
}

// ---------- handler ----------

export async function GET(req: Request) {
  const mode = parseMode(req.url);

  if (mode) {
    // Static mode-highlight - no DB call, cache longer
    return new ImageResponse(renderModeCard(mode), {
      ...size,
      headers: {
        'Cache-Control':
          'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }

  // Bare /og - dynamic live tally
  const totals = await fetchTotals();
  const totalPower = totals.reduce((s, t) => s + Number(t.total_power || 0), 0);
  const byMode = new Map(totals.map((t) => [t.mode, Number(t.total_power || 0)]));
  const rows = MODE_IDS.map((id) => {
    const power = byMode.get(id) ?? 0;
    const pct = totalPower > 0 ? Math.round((power / totalPower) * 100) : 0;
    return { id, pct };
  });

  return new ImageResponse(renderTallyCard(rows, totalPower), {
    ...size,
    headers: {
      // One DB roundtrip per minute per region even if a cast goes viral
      'Cache-Control':
        'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
