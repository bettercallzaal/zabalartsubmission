'use client';

import { useEffect, useState, useTransition, useOptimistic } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { Confetti } from './Confetti';
import { Countdown } from './Countdown';

const MODES = [
  { id: 'music', label: 'Music', blurb: 'Drops, jams, mixes. Music-week focus.', icon: '♫' },
  { id: 'governance', label: 'Governance', blurb: 'Proposal sprints. Voting drives.', icon: '⚖' },
  { id: 'events', label: 'Events', blurb: 'IRL + virtual gatherings.', icon: '⚫' },
  { id: 'build', label: 'Build', blurb: 'Dev, agents, infra. Ship week.', icon: '⛏' },
] as const;

type Mode = (typeof MODES)[number]['id'];

interface ModeTotal {
  mode: string;
  vote_count: number;
  total_power: number;
}

interface VotePower {
  fid: number;
  username: string | null;
  power: number;
  zaoCasts: number;
  neynarScore: number;
}

interface OptimisticAction {
  mode: Mode;
  prevMode: Mode | null;
  power: number;
}

export function ZabalVoteClient({ initialTotals }: { initialTotals: ModeTotal[] }) {
  const [fid, setFid] = useState<number | null>(null);
  const [votePower, setVotePower] = useState<VotePower | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode | null>(null);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [status, setStatus] = useState<string>('');
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);
  const [hasVotedThisSession, setHasVotedThisSession] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Optimistic totals - applies the user's vote instantly on click,
  // before the POST round-trip completes. Reverts automatically if the
  // server action throws.
  const [optimisticTotals, addOptimisticVote] = useOptimistic(
    initialTotals,
    (state: ModeTotal[], action: OptimisticAction) => {
      const next = state.map((t) => ({ ...t }));
      // Remove power from previous mode if switching
      if (action.prevMode) {
        const prev = next.find((t) => t.mode === action.prevMode);
        if (prev) prev.total_power = Math.max(0, Number(prev.total_power) - action.power);
      }
      // Add to new mode (or create the row if first vote in that mode this week)
      const tgt = next.find((t) => t.mode === action.mode);
      if (tgt) {
        tgt.total_power = Number(tgt.total_power) + action.power;
      } else {
        next.push({ mode: action.mode, vote_count: 1, total_power: action.power });
      }
      return next;
    },
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await sdk.context;
        const userFid = ctx?.user?.fid;
        // Base App can report fid -1 when context isn't ready (Issue #537);
        // treat anything < 1 as "no FID yet".
        if (cancelled || !userFid || userFid < 1) return;
        setFid(userFid);

        // Prime the vote-power cache; required by /api/vote (anti-sybil floor).
        // sdk.actions.ready() is fired globally by <MiniAppReady /> in the
        // root layout, so a slow fetch here never sticks the splash.
        const res = await fetch(`/api/calculate-vote-power?fid=${userFid}`);
        if (res.ok) {
          const data = (await res.json()) as VotePower;
          if (!cancelled) setVotePower(data);
        }
      } catch (err) {
        if (!cancelled) setStatus(`miniapp init failed: ${String(err).slice(0, 80)}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPower = optimisticTotals.reduce((s, t) => s + Number(t.total_power || 0), 0);
  const totalVotes = optimisticTotals.reduce((s, t) => s + Number(t.vote_count || 0), 0);

  function pct(mode: Mode): number {
    const t = optimisticTotals.find((x) => x.mode === mode);
    if (!t || totalPower === 0) return 0;
    return Math.round((Number(t.total_power) / totalPower) * 100);
  }

  function castVote(mode: Mode) {
    if (!fid) {
      setStatus('Open this in Farcaster to vote.');
      return;
    }
    if (!votePower) {
      setStatus('Calculating your vote power, try again in a sec.');
      return;
    }
    if (pendingMode) return; // ignore re-tap mid-flight on the same mode
    const prev = currentMode;
    if (prev === mode) {
      setStatus(`Locked in ${mode} (+${votePower.power}).`);
      return;
    }
    setPendingMode(mode);
    const isFirstVoteThisSession = !hasVotedThisSession;
    startTransition(async () => {
      // INSTANT - paint the new state in the same frame as the tap
      addOptimisticVote({ mode, prevMode: prev, power: votePower.power });
      setCurrentMode(mode);
      setStatus(
        prev ? `Switched to ${mode} (+${votePower.power}).` : `Locked in ${mode} (+${votePower.power}).`,
      );
      if (isFirstVoteThisSession) {
        setConfettiTrigger(Date.now()); // first-vote-of-session dopamine
        setHasVotedThisSession(true);
      }
      try {
        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fid, mode }),
        });
        if (!res.ok) {
          const errBody = await res.text().catch(() => '');
          // Roll back our local state. useOptimistic reverts automatically
          // when the transition's async work throws - so throw here.
          setCurrentMode(prev);
          throw new Error(`Vote failed (${res.status}). ${errBody.slice(0, 120)}`);
        }
        // No post-vote /api/week-totals fetch - the optimistic state IS the
        // truth until the next page-level revalidation. Skipping the second
        // round-trip is what makes voting feel instant.

        // Vote succeeded - prompt to add ZABAL to the user's Mini Apps
        // drawer, but only once per browser so we don't badger people.
        // Silent on decline/already-added (both throw rejected_by_user
        // or no-op). (Research Doc 733, ranked action #6.)
        try {
          if (
            typeof window !== 'undefined' &&
            !window.localStorage.getItem('zabal_add_prompted')
          ) {
            window.localStorage.setItem('zabal_add_prompted', String(Date.now()));
            await sdk.actions.addMiniApp();
          }
        } catch {
          // user declined or app already added - both fine, stay silent
        }
      } catch (err) {
        setStatus(String(err).replace(/^Error: /, ''));
      } finally {
        setPendingMode(null);
      }
    });
  }

  async function shareCast() {
    if (!currentMode) return;
    const mode = MODES.find((m) => m.id === currentMode);
    if (!mode) return;
    try {
      await sdk.actions.composeCast({
        text: `Voted ${mode.label} this week on @zabal. Pick yours:`,
        // mode-aware deep link - landing page reads ?mode= and uses
        // a mode-highlighted OG variant so the cast preview shows the
        // user's faction (Research Doc 733, ranked action #3).
        embeds: [`https://zabal.art?mode=${mode.id}`],
        // Route every share-cast into the /zao channel so subscribers
        // see it in addition to the user's followers. Free 2x distribution
        // (Research Doc 733, Sub-Agent C - largest under-used SDK lever).
        channelKey: 'zao',
      });
    } catch (err) {
      setStatus(`Share failed: ${String(err).slice(0, 80)}`);
    }
  }

  async function copyLink() {
    try {
      // Deep-link to the hub. fc:miniapp embed on / makes the URL
      // open as a Mini App launch card if pasted into Farcaster, or
      // a normal browser link anywhere else.
      await navigator.clipboard.writeText('https://zabal.art');
      setStatus('Link copied. Paste it anywhere.');
    } catch {
      setStatus('Copy failed - long-press to copy the URL bar.');
    }
  }

  return (
    <section style={{ padding: '0 2rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      <Confetti trigger={confettiTrigger} />
      <div
        style={{
          background: 'rgba(20, 30, 39, 0.6)',
          border: '1px solid rgba(224, 221, 170, 0.2)',
          borderRadius: 12,
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '0.95rem', color: '#a0a0a0' }}>
          {fid ? (
            <>
              You: <strong style={{ color: '#fff' }}>{votePower?.username ?? `fid ${fid}`}</strong>
              {' - '}vote power{' '}
              <strong
                style={{
                  color: '#e0ddaa',
                  cursor: 'help',
                  borderBottom: '1px dotted rgba(224, 221, 170, 0.5)',
                }}
                title="Power = base 1 + /zao cast bonus (0-3) blended with Neynar score (0.5x-1.5x), capped at 6."
              >
                {votePower?.power ?? '…'}
              </strong>
              {votePower?.zaoCasts != null && (
                <>
                  {' '}
                  <span style={{ color: '#666' }}>
                    ({votePower.zaoCasts} /zao casts, neynar {votePower.neynarScore?.toFixed?.(2)})
                  </span>
                </>
              )}
            </>
          ) : (
            'Open in Farcaster to see your vote power.'
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'zabalPulse 2s infinite',
            }}
          />
          Week power: <strong style={{ color: '#e0ddaa' }}>{totalPower}</strong>
          <span style={{ color: '#666', marginLeft: '0.4rem' }}>
            · {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} · closes in <Countdown />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes zabalPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {MODES.map((m) => {
          const p = pct(m.id);
          const isCurrent = currentMode === m.id;
          const isPendingHere = pendingMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => castVote(m.id)}
              disabled={isPendingHere}
              aria-pressed={isCurrent}
              style={{
                cursor: isPendingHere ? 'wait' : 'pointer',
                background: isCurrent ? 'rgba(224, 221, 170, 0.15)' : 'rgba(20, 30, 39, 0.6)',
                border: `1px solid ${isCurrent ? '#e0ddaa' : 'rgba(224, 221, 170, 0.2)'}`,
                borderRadius: 16,
                padding: '1.5rem 1.25rem',
                color: '#fff',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                opacity: isPendingHere ? 0.85 : 1,
                transition: 'background 0.2s ease, border-color 0.2s ease, opacity 0.15s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${p}%`,
                  background:
                    'linear-gradient(90deg, rgba(224, 221, 170, 0.1), rgba(224, 221, 170, 0.02))',
                  pointerEvents: 'none',
                  // P0 fix: smooth pct-bar transition (was missing on live)
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                <span style={{ color: '#e0ddaa', fontWeight: 700 }}>{p}%</span>
              </div>
              <h3 style={{ position: 'relative', fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
                {m.label}
              </h3>
              <p style={{ position: 'relative', fontSize: '0.85rem', color: '#a0a0a0', margin: 0 }}>
                {m.blurb}
              </p>
            </button>
          );
        })}
      </div>

      {status && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#e0ddaa', textAlign: 'center' }}>
          {status}
        </p>
      )}

      {currentMode && fid && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={shareCast}
            style={{
              background: '#e0ddaa',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 999,
              padding: '0.55rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              boxShadow: '0 2px 10px rgba(224, 221, 170, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(224, 221, 170, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(224, 221, 170, 0.15)';
            }}
          >
            Share to /zao -&gt;
          </button>
          <button
            onClick={copyLink}
            style={{
              background: 'transparent',
              color: '#e0ddaa',
              border: '1px solid rgba(224, 221, 170, 0.4)',
              borderRadius: 999,
              padding: '0.55rem 1.2rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(224, 221, 170, 0.08)';
              e.currentTarget.style.borderColor = '#e0ddaa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(224, 221, 170, 0.4)';
            }}
          >
            Copy link
          </button>
        </div>
      )}
    </section>
  );
}
