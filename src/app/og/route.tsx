import { ImageResponse } from 'next/og';

// OG / Mini App embed image for the ZABAL hub. Referenced by the
// per-route fc:miniapp embed in src/app/page.tsx.
//
// Mode-aware: `?mode=music|governance|events|build` highlights one
// mode so a share-cast carries the voter's faction visually. Stays
// edge-runtime + dependency-free (no DB calls, no Node APIs).
// (Research Doc 733, ranked action #3.)

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 800 };

const MODES = ['Music', 'Governance', 'Events', 'Build'] as const;
type ModeId = 'music' | 'governance' | 'events' | 'build';

function parseMode(url: string): ModeId | null {
  try {
    const m = new URL(url).searchParams.get('mode')?.toLowerCase();
    if (m === 'music' || m === 'governance' || m === 'events' || m === 'build') {
      return m;
    }
  } catch {
    // bad url - fall through to no-mode
  }
  return null;
}

export async function GET(req: Request) {
  const selected = parseMode(req.url);
  const subtitle = selected
    ? `My pick: ${selected.charAt(0).toUpperCase() + selected.slice(1)}`
    : 'Vote weekly on ZAO direction';

  return new ImageResponse(
    (
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
            fontSize: 28,
            color: '#a0a0a0',
            marginTop: 32,
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {MODES.map((label) => {
            const isSelected = selected && label.toLowerCase() === selected;
            return (
              <span
                key={label}
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
                {label}
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
    ),
    {
      ...size,
      headers: {
        // CDN cache mode variants for 5 min, browsers for 1 min.
        // No DB call so this is cheap, but the cache still reduces
        // re-render work on viral casts.
        'Cache-Control':
          'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
