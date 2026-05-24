import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { logger } from '@/lib/logger';

// Daily ZABAL tally cast posted to the /zao channel by the ZABAL
// signer. Pulls live week totals from Supabase, formats them, posts
// via Neynar v2 publish_cast, and embeds zabal.art?mode=<leader> so
// the cast preview shows the current leading faction.
//
// Scheduled via vercel.json: `0 13 * * *` = 13:00 UTC = 9am ET
// (8am during DST). Runs once per day.
//
// Required env:
//   NEYNAR_API_KEY       - read existing setting
//   NEYNAR_SIGNER_UUID   - ZABAL signer registered in Neynar dashboard
//   CRON_SECRET          - Vercel cron auth header
//
// If NEYNAR_SIGNER_UUID is missing, the route returns 503 with a
// pointer to set it up. The cron will just fail silently in Vercel
// logs - nothing else breaks.
//
// (Research Doc 733, ranked action #5 - the daily heartbeat cast.)

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

interface NeynarCastResponse {
  cast?: { hash: string };
  success?: boolean;
  message?: string;
}

async function fetchWeekTotals(): Promise<ModeTotal[]> {
  const { data, error } = await supabaseAdmin.rpc('get_this_zabal_weeks_votes');
  if (error || !data) return [];
  return data as ModeTotal[];
}

function formatTallyLine(totals: ModeTotal[]): {
  text: string;
  leader: string | null;
  totalPower: number;
} {
  const byMode = new Map(totals.map((t) => [t.mode, Number(t.total_power || 0)]));
  const totalPower = Array.from(byMode.values()).reduce((s, n) => s + n, 0);

  // Rank modes by power desc; tie-broken by canonical MODE_ORDER for stability
  const ranked = MODE_ORDER
    .map((m) => ({ mode: m, power: byMode.get(m) ?? 0 }))
    .sort((a, b) => b.power - a.power);

  if (totalPower === 0) {
    return {
      text: 'ZABAL today: no votes yet this week. Be first. zabal.art',
      leader: null,
      totalPower: 0,
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
    totalPower,
  };
}

async function publishCast(text: string, embedUrl: string): Promise<NeynarCastResponse> {
  const apiKey = process.env.NEYNAR_API_KEY;
  const signerUuid = process.env.NEYNAR_SIGNER_UUID;
  if (!apiKey || !signerUuid) {
    throw new Error('NEYNAR_API_KEY or NEYNAR_SIGNER_UUID missing');
  }
  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      signer_uuid: signerUuid,
      text,
      embeds: [{ url: embedUrl }],
      channel_id: 'zao',
    }),
  });
  const body = (await res.json().catch(() => ({}))) as NeynarCastResponse;
  if (!res.ok) {
    throw new Error(
      `Neynar publish_cast ${res.status}: ${body.message ?? JSON.stringify(body)}`,
    );
  }
  return body;
}

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer ${CRON_SECRET}
  const auth = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Fail loudly + early if the signer isn't configured. Returns 503 so
  // Vercel cron history shows the misconfiguration explicitly.
  if (!process.env.NEYNAR_API_KEY || !process.env.NEYNAR_SIGNER_UUID) {
    return NextResponse.json(
      {
        ok: false,
        error: 'NEYNAR_API_KEY or NEYNAR_SIGNER_UUID not set',
        howto:
          'Create a Farcaster signer for the ZABAL identity at https://dev.neynar.com, then set NEYNAR_SIGNER_UUID in Vercel project env.',
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
    const result = await publishCast(text, embedUrl);
    logger.info('zabal-daily-cast posted', { hash: result.cast?.hash, leader });
    return NextResponse.json({ ok: true, cast: result.cast, leader, text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('zabal-daily-cast failed', { error: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
