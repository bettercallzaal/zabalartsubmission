// ZAOstock hero - top-of-fold festival anchor.
//
// ZAOstock is The ZAO's flagship IRL festival (Oct 2026, Ellsworth ME)
// under the ZAO Festivals umbrella (alongside ZAO-PALOOZA + ZAO CHELLA).
// Highest-visibility ecosystem-pull lever per Research Doc 733
// (ranked action #10).
//
// Static server component, no data dep. To update the date or
// location, edit FESTIVAL_DATE_LABEL + FESTIVAL_LOCATION below.

const FESTIVAL_DATE_LABEL = 'October 2026';
const FESTIVAL_LOCATION = 'Ellsworth, ME';
const FESTIVAL_URL = 'https://zaoos.com/stock';

export function ZaoStockHero() {
  return (
    <section
      id="zaostock"
      style={{ padding: '0 2rem 2rem', maxWidth: 960, margin: '0 auto' }}
    >
      <a
        href={FESTIVAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background:
            'linear-gradient(135deg, #1a0f24 0%, #0a0a0a 50%, #0a1628 100%)',
          border: '1px solid rgba(224, 221, 170, 0.35)',
          borderRadius: 18,
          padding: '1.75rem 2rem',
          color: '#fff',
          textDecoration: 'none',
          boxShadow: '0 4px 24px rgba(224, 221, 170, 0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gold pill - festival flag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#e0ddaa',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#e0ddaa',
            }}
          />
          ZAO Festivals - flagship event
        </div>

        {/* Festival name - hero typography */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              margin: 0,
              background: 'linear-gradient(135deg, #ffffff 0%, #e0ddaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ZAOstock
          </h2>
          <div
            style={{
              color: '#e0ddaa',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {FESTIVAL_DATE_LABEL} - {FESTIVAL_LOCATION}
          </div>
        </div>

        {/* One-line pitch */}
        <p
          style={{
            color: '#cfd2d6',
            fontSize: '0.95rem',
            margin: 0,
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          The ZAO&apos;s flagship IRL festival - artists, builders, music, governance
          fractals, and the people behind WaveWarZ, COC Concertz, and The ZAO,
          all in one place.
        </p>

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '0.4rem',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#e0ddaa',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.5rem 1.1rem',
              borderRadius: 999,
            }}
          >
            Learn more -&gt;
          </span>
          <span style={{ color: '#a0a0a0', fontSize: '0.8rem' }}>
            zaoos.com/stock
          </span>
        </div>
      </a>
    </section>
  );
}
