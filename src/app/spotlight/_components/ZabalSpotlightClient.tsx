'use client';

import { useEffect, useState, useTransition, useOptimistic } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface Nominee {
  nominee_fid: number;
  nomination_count: number;
  reasons: string[] | null;
  username: string | null;
  pfp_url: string | null;
}

type Phase = 'nominate' | 'vote' | 'closed';

function currentPhase(): Phase {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short' });
  const day = fmt.format(new Date());
  if (['Mon', 'Tue', 'Wed'].includes(day)) return 'nominate';
  if (['Thu', 'Fri', 'Sat', 'Sun'].includes(day)) return 'vote';
  return 'closed';
}

export function ZabalSpotlightClient() {
  const [phase] = useState<Phase>(currentPhase());
  const [fid, setFid] = useState<number | null>(null);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [nomineeInput, setNomineeInput] = useState<string>('');
  const [reasonInput, setReasonInput] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [pendingVoteFid, setPendingVoteFid] = useState<number | null>(null);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [isPendingNom, startNomTransition] = useTransition();
  const [, startVoteTransition] = useTransition();

  // Optimistic nominees - shows the new nomination instantly when you submit.
  const [optimisticNominees, addOptimisticNomination] = useOptimistic(
    nominees,
    (state: Nominee[], action: { nominee_fid: number; reason: string | null }) => {
      const next = [...state];
      const existing = next.find((n) => n.nominee_fid === action.nominee_fid);
      if (existing) {
        existing.nomination_count = existing.nomination_count + 1;
        if (action.reason) {
          existing.reasons = [...(existing.reasons ?? []), action.reason];
        }
      } else {
        next.push({
          nominee_fid: action.nominee_fid,
          nomination_count: 1,
          reasons: action.reason ? [action.reason] : null,
          username: null,
          pfp_url: null,
        });
      }
      // Re-sort by nomination_count desc
      next.sort((a, b) => b.nomination_count - a.nomination_count);
      return next;
    },
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await sdk.context;
        const userFid = ctx?.user?.fid;
        if (cancelled) return;
        // Base App can report fid -1 before context settles (Issue #537).
        if (userFid && userFid >= 1) setFid(userFid);

        // sdk.actions.ready() is fired globally by <MiniAppReady /> in the
        // root layout - not called here, so a slow fetch never sticks the splash.
        const res = await fetch('/api/spotlight/nominees?limit=8');
        if (res.ok) {
          const data = (await res.json()) as { nominees: Nominee[] };
          if (!cancelled) setNominees(data.nominees ?? []);
        }
      } catch (err) {
        if (!cancelled) setStatus(`init failed: ${String(err).slice(0, 80)}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function submitNomination() {
    if (!fid) return setStatus('Open in Farcaster to nominate.');
    const nomineeFid = Number(nomineeInput.trim());
    if (!Number.isInteger(nomineeFid) || nomineeFid <= 0) {
      return setStatus('Enter a numeric Farcaster FID.');
    }
    if (nomineeFid === fid) return setStatus('Cannot nominate yourself.');
    const reason = reasonInput.trim() || null;
    startNomTransition(async () => {
      // INSTANT - show the new nomination in the list immediately
      addOptimisticNomination({ nominee_fid: nomineeFid, reason });
      setStatus('Nominated.');
      const inputBackup = { nominee: nomineeInput, reason: reasonInput };
      setNomineeInput('');
      setReasonInput('');
      try {
        const res = await fetch('/api/spotlight/nominate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nominator_fid: fid,
            nominee_fid: nomineeFid,
            reason: reason ?? undefined,
          }),
        });
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          // Restore inputs so the user can retry without re-typing
          setNomineeInput(inputBackup.nominee);
          setReasonInput(inputBackup.reason);
          throw new Error(`Failed (${res.status}). ${t.slice(0, 120)}`);
        }
        // Refresh nominees so the real list (with username/pfp resolution) replaces the optimistic one
        const ref = await fetch('/api/spotlight/nominees?limit=8').catch(() => null);
        if (ref && ref.ok) {
          const data = (await ref.json()) as { nominees: Nominee[] };
          setNominees(data.nominees ?? []);
        }
      } catch (err) {
        setStatus(String(err).replace(/^Error: /, ''));
      }
    });
  }

  function castVote(nomineeFid: number) {
    if (!fid) return setStatus('Open in Farcaster to vote.');
    if (pendingVoteFid) return;
    if (votedFor === nomineeFid) {
      setStatus(`Already voted for fid ${nomineeFid} this week.`);
      return;
    }
    setPendingVoteFid(nomineeFid);
    startVoteTransition(async () => {
      // INSTANT visual selection
      setVotedFor(nomineeFid);
      setStatus(`Voted for fid ${nomineeFid}.`);
      try {
        const res = await fetch('/api/spotlight/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voter_fid: fid, nominee_fid: nomineeFid }),
        });
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          setVotedFor(null);
          throw new Error(`Failed (${res.status}). ${t.slice(0, 120)}`);
        }
      } catch (err) {
        setStatus(String(err).replace(/^Error: /, ''));
      } finally {
        setPendingVoteFid(null);
      }
    });
  }

  return (
    <section style={{ padding: '0 2rem 1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <div
        style={{
          background: 'rgba(20, 30, 39, 0.6)',
          border: '1px solid rgba(224, 221, 170, 0.2)',
          borderRadius: 12,
          padding: '1rem 1.5rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            animation: 'zabalSpotPulse 2s infinite',
          }}
        />
        <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>Current phase:</span>{' '}
        <strong style={{ color: '#e0ddaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {phase}
        </strong>
      </div>

      <style>{`
        @keyframes zabalSpotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
      `}</style>

      {phase === 'nominate' && (
        <div
          style={{
            background: 'rgba(20, 30, 39, 0.6)',
            border: '1px solid rgba(224, 221, 170, 0.2)',
            borderRadius: 16,
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#e0ddaa' }}>Nominate a ZAO member</h3>
          <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem' }}>
            FID of the person who shipped this week. Add an optional 280-char reason.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              placeholder="Nominee FID"
              value={nomineeInput}
              onChange={(e) => setNomineeInput(e.target.value)}
              style={input({ flex: '0 0 180px' })}
            />
            <input
              type="text"
              placeholder="Reason (optional, 280 chars max)"
              value={reasonInput}
              maxLength={280}
              onChange={(e) => setReasonInput(e.target.value)}
              style={input({ flex: '1 1 320px' })}
            />
            <button
              onClick={submitNomination}
              disabled={isPendingNom || !fid}
              style={primaryButton(isPendingNom || !fid)}
            >
              Nominate
            </button>
          </div>
        </div>
      )}

      {phase === 'vote' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#e0ddaa', marginTop: 0 }}>This week’s ballot</h3>
          {optimisticNominees.length === 0 ? (
            <p style={{ color: '#a0a0a0' }}>No nominees yet for this week.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {optimisticNominees.map((n) => {
                const isVoted = votedFor === n.nominee_fid;
                const isPendingHere = pendingVoteFid === n.nominee_fid;
                return (
                  <div
                    key={n.nominee_fid}
                    style={{
                      background: isVoted ? 'rgba(224, 221, 170, 0.12)' : 'rgba(20, 30, 39, 0.6)',
                      border: `1px solid ${isVoted ? '#e0ddaa' : 'rgba(224, 221, 170, 0.2)'}`,
                      borderRadius: 16,
                      padding: '1.25rem',
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{n.username ?? `fid ${n.nominee_fid}`}</strong>
                      <span style={{ color: '#e0ddaa' }}>{n.nomination_count} nom.</span>
                    </div>
                    {n.reasons && n.reasons.length > 0 && (
                      <p
                        style={{
                          color: '#a0a0a0',
                          fontSize: '0.85rem',
                          marginTop: '0.5rem',
                          marginBottom: '1rem',
                        }}
                      >
                        “{n.reasons[0]}”
                      </p>
                    )}
                    <button
                      onClick={() => castVote(n.nominee_fid)}
                      disabled={isPendingHere || !fid || isVoted}
                      style={primaryButton(isPendingHere || !fid || isVoted, { width: '100%' })}
                    >
                      {isVoted ? 'Voted' : isPendingHere ? 'Voting...' : 'Vote'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {status && (
        <p
          style={{
            fontSize: '0.9rem',
            color: '#e0ddaa',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          {status}
        </p>
      )}
    </section>
  );
}

function input(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: 'rgba(10, 10, 10, 0.6)',
    border: '1px solid rgba(224, 221, 170, 0.3)',
    borderRadius: 8,
    padding: '0.5rem 0.75rem',
    color: '#fff',
    fontSize: '0.95rem',
    ...extra,
  };
}

function primaryButton(disabled: boolean, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: disabled ? 'rgba(224, 221, 170, 0.15)' : '#e0ddaa',
    color: disabled ? '#a0a0a0' : '#0a0a0a',
    border: 'none',
    borderRadius: 8,
    padding: '0.6rem 1.25rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...extra,
  };
}
