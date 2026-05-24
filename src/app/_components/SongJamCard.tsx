// SongJam card - surfaces the $ZABAL Empire leaderboard living on
// songjam.space/zabal. SongJam consumes our /api/empire-leaderboard
// feed (apiLeaderboards format), so this is the canonical place
// to see how you rank in the Empire.
//
// Static server component, no data fetch. SongJam doesn't expose a
// public read API beyond their SPA, so we link out rather than
// scrape. (Research Doc 733, ranked action #4 - adapted.)

const GOLD = '#e0ddaa';
const DIM = '#a0a0a0';
const BORDER = 'rgba(224, 221, 170, 0.2)';

export function SongJamCard() {
  return (
    <section
      id="empire"
      style={{ padding: '0 2rem 2rem', maxWidth: 960, margin: '0 auto' }}
    >
      <a
        href="https://songjam.space/zabal"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap',
          background:
            'linear-gradient(135deg, rgba(224, 221, 170, 0.08) 0%, rgba(20, 30, 39, 0.6) 60%)',
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: '1.4rem 1.75rem',
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: GOLD,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: GOLD,
              }}
            />
            $ZABAL Empire on SongJam
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
            Track your rank, win SANG rewards
          </div>
          <div style={{ color: DIM, fontSize: '0.9rem' }}>
            The cumulative voting leaderboard powers the $ZABAL Empire on
            songjam.space. Hold $ZABAL, vote weekly, climb.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: GOLD,
            fontWeight: 700,
            fontSize: '0.95rem',
            borderLeft: `1px solid ${BORDER}`,
            paddingLeft: '1.25rem',
            whiteSpace: 'nowrap',
          }}
        >
          View on SongJam -&gt;
        </div>
      </a>
    </section>
  );
}
