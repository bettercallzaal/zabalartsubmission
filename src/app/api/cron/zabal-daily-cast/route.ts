import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { logger } from '@/lib/logger';
import { publishCast } from '@/lib/farcaster/publish';

// Daily ZABAL tally cast posted to the /zao channel.
//
// Reads this week's mode totals from Supabase, formats a one-line
// summary, and submits a CastAdd message directly to a Snapchain Hub
// (default: haatz.quilibrium.com - Quilibrium's Hypersnap proxy).
// Fully Neynar-free - signs with the ZABAL Ed25519 signer registered
// on Optimism's KeyGateway via scripts/generate-zabal-signer.ts.
//
// Scheduled via vercel.json: `0 13 * * *` = 13:00 UTC = 9am ET
// (8am during DST). Runs once per day.
//
// Required env:
//   CRON_SECRET                - Vercel cron auth header
//   ZABAL_FID                  - integer FID of the ZABAL Farcaster account
//   ZABAL_SIGNER_PRIVATE_KEY   - hex Ed25519 signer key (approved on KeyGateway)
//   ZABAL_HUB_URL              - optional, defaults to haatz.quilibrium.com
//
// If signer env vars are missing the route returns 503 with a pointer
// to the setup script. Nothing else breaks.
//
// (Research Doc 733, ranked action #5 + user feedback - Quilibrium-aligned.)

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MODE_LABEL: Record<string, string> = {
  music: 'Music',
  governance: 'Governance',
  events: 'Events',
  build: 'Build',
};

const MODE_ORDER = ['music', 'governance', 'events', 'build'] as const;

interface ModeTotal {
  mode: string;
  vote_count: number;
  total_power: number;
}

async function fetchWeekTotals(): Promise<ModeTotal[]> {
  const { data, error } = await supabaseAdmin.rpc('get_this_zabal_weeks_votes');
  if (error || !data) return [];
  return data as ModeTotal[];
}

function formatTallyLine(totals: ModeTotal[]): {
  text: string;
  leader: string | null;
} {
  const byMode = new Map(totals.map((t) => [t.mode, Number(t.total_power || 0)]));
  const totalPower = Array.from(byMode.values()).reduce((s, n) => s + n, 0);

  // Rank modes by power desc; tie-broken by canonical MODE_ORDER
  const ranked = MODE_ORDER
    .map((m) => ({ mode: m, power: byMode.get(m) ?? 0 }))
    .sort((a, b) => b.power - a.power);

  if (totalPower === 0) {
    return {
      text: 'ZABAL today: no votes yet this week. Be first. zabal.art',
      leader: null,
    };
  }

  const leader = ranked[0].mode;
  const pcts = ranked
    .map(
      (r) => `${MODE_LABEL[r.mode] ?? r.mode} ${Math.round((r.power / totalPower) * 100)}%`,
    )
    .join(' - ');

  return {
    text: `ZABAL today: ${pcts}. Vote -> zabal.art`,
    leader,
  };
}

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer ${CRON_SECRET}
  const auth = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Fail loudly + early if the signer isn't configured.
  if (!process.env.ZABAL_FID || !process.env.ZABAL_SIGNER_PRIVATE_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: 'ZABAL_FID or ZABAL_SIGNER_PRIVATE_KEY not set',
        howto:
          'Run `npx tsx scripts/generate-zabal-signer.ts` once to generate the keypair, approve the public key for the ZABAL account in Warpcast, then set ZABAL_FID + ZABAL_SIGNER_PRIVATE_KEY in Vercel project env.',
      },
      { status: 503 },
    );
  }

  try {
    const totals = await fetchWeekTotals();
    const { text, leader } = formatTallyLine(totals);
    const embedUrl = leader
      ? `https://zabal.art?mode=${leader}`
      : 'https://zabal.art';
    const result = await publishCast({
      text,
      embeds: [embedUrl],
      channelKey: 'zao',
    });
    logger.info('zabal-daily-cast posted', {
      hash: result.hash,
      fid: result.fid,
      hub: result.hubUrl,
      leader,
    });
    return NextResponse.json({
      ok: true,
      cast: { hash: result.hash, fid: result.fid },
      hub: result.hubUrl,
      leader,
      text,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('zabal-daily-cast failed', { error: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
