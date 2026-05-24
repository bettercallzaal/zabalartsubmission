// Skeleton fallbacks for Suspense streaming on the ZABAL hub.
// Doc 728 P2 - render the page shell instantly; data sections shimmer
// in as their Supabase RPCs resolve, instead of blocking TTFB on all 3.

const BORDER = 'rgba(224, 221, 170, 0.18)';
const PANEL = 'rgba(20, 30, 39, 0.45)';

const SHIMMER = `
  @keyframes zabalShimmer {
    0% { background-position: -300px 0; }
    100% { background-position: 300px 0; }
  }
`;

function shimmerStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background:
      'linear-gradient(90deg, rgba(224,221,170,0.04) 0%, rgba(224,221,170,0.12) 50%, rgba(224,221,170,0.04) 100%)',
    backgroundSize: '600px 100%',
    animation: 'zabalShimmer 1.6s ease-in-out infinite',
    borderRadius: 4,
    ...extra,
  };
}

export function VoteCardsSkeleton() {
  return (
    <section style={{ padding: '0 2rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      <style>{SHIMMER}</style>
      <div
        style={{
          background: PANEL,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={shimmerStyle({ height: 14, width: '70%' })} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '1.5rem 1.25rem',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={shimmerStyle({ height: 24, width: 28 })} />
              <div style={shimmerStyle({ height: 16, width: 36 })} />
            </div>
            <div style={shimmerStyle({ height: 20, width: '60%' })} />
            <div style={shimmerStyle({ height: 12, width: '85%' })} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function LeaderboardSkeleton() {
  return (
    <section style={{ padding: '0 2rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      <style>{SHIMMER}</style>
      <div style={shimmerStyle({ height: 22, width: 140, marginBottom: 16 })} />
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
              background: i === 0 ? PANEL : 'transparent',
            }}
          >
            <div style={shimmerStyle({ height: 14, width: 18 })} />
            <div style={shimmerStyle({ height: 14, width: 120, flex: 1 })} />
            <div style={shimmerStyle({ height: 14, width: 40 })} />
            <div style={shimmerStyle({ height: 14, width: 36 })} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SpotlightCardSkeleton() {
  return (
    <section style={{ padding: '2.5rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      <style>{SHIMMER}</style>
      <div style={shimmerStyle({ height: 22, width: 180, marginBottom: 16 })} />
      <div
        style={{
          background: PANEL,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        <div style={shimmerStyle({ height: 16, width: '80%' })} />
        <div style={shimmerStyle({ height: 14, width: '40%' })} />
      </div>
    </section>
  );
}
