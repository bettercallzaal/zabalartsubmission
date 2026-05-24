// ZABAL cast publishing - dual backend.
//
// Picks publish backend based on env presence:
//   1. ZABAL_SIGNER_PRIVATE_KEY + ZABAL_FID set
//      -> direct Hub submit via HAATZ. Pure Quilibrium-aligned path.
//      -> Required env: ZABAL_FID, ZABAL_SIGNER_PRIVATE_KEY
//      -> Optional env: ZABAL_HUB_URL (defaults to haatz.quilibrium.com)
//
//   2. Else NEYNAR_SIGNER_UUID set
//      -> Neynar publish_cast (uses Neynar's managed signer which the
//         user approved one-time in Warpcast)
//      -> Required env: NEYNAR_API_KEY, NEYNAR_SIGNER_UUID
//
//   3. Else throws "no signer configured"
//
// Either backend posts the same content + channel. The route handler
// in api/cron/zabal-daily-cast doesn't need to know which backend
// is active - it just calls publishCast() and gets back a hash.

import {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message,
  type CastAddBody,
} from '@farcaster/hub-nodejs';

const DEFAULT_HUB = 'https://haatz.quilibrium.com';
const ZAO_CHANNEL_PARENT_URL = 'https://warpcast.com/~/channel/zao';

export interface PublishCastInput {
  text: string;
  embeds?: string[];
  /** Channel name (e.g. 'zao'). Maps to the Warpcast parentUrl. */
  channelKey?: string;
}

export interface PublishCastResult {
  hash: string;
  backend: 'haatz' | 'neynar';
  /** Where it landed - hub URL for haatz, n/a for neynar */
  hub?: string;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length !== 64) {
    throw new Error(`Signer private key must be 64 hex chars (got ${clean.length})`);
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function parentUrlForChannel(channelKey: string): string {
  if (channelKey === 'zao') return ZAO_CHANNEL_PARENT_URL;
  return `https://warpcast.com/~/channel/${channelKey}`;
}

// ----- Backend 1: HAATZ direct -----

async function publishViaHaatz(input: PublishCastInput): Promise<PublishCastResult> {
  const fidStr = process.env.ZABAL_FID;
  const privHex = process.env.ZABAL_SIGNER_PRIVATE_KEY!;
  const hubUrl = process.env.ZABAL_HUB_URL || DEFAULT_HUB;

  const fid = Number(fidStr);
  if (!Number.isInteger(fid) || fid <= 0) {
    throw new Error(`ZABAL_FID must be a positive integer (got ${fidStr})`);
  }

  const signer = new NobleEd25519Signer(hexToBytes(privHex));

  const body: CastAddBody = {
    text: input.text,
    embeds: (input.embeds ?? []).map((url) => ({ url })),
    embedsDeprecated: [],
    mentions: [],
    mentionsPositions: [],
    type: 0,
    ...(input.channelKey ? { parentUrl: parentUrlForChannel(input.channelKey) } : {}),
  };

  const built = await makeCastAdd(
    body,
    { fid, network: FarcasterNetwork.MAINNET },
    signer,
  );
  if (built.isErr()) {
    throw new Error(`Cast construction failed: ${built.error.message}`);
  }
  const castMessage = built.value;
  const messageBytes = Message.encode(castMessage).finish();

  const res = await fetch(`${hubUrl}/v1/submitMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: messageBytes,
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`HAATZ submit ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const hash = castMessage.hash ? `0x${bytesToHex(castMessage.hash)}` : '(unknown)';
  return { hash, backend: 'haatz', hub: hubUrl };
}

// ----- Backend 2: Neynar managed signer -----

interface NeynarCastResponse {
  cast?: { hash: string };
  success?: boolean;
  message?: string;
}

async function publishViaNeynar(input: PublishCastInput): Promise<PublishCastResult> {
  const apiKey = process.env.NEYNAR_API_KEY;
  const signerUuid = process.env.NEYNAR_SIGNER_UUID!;
  if (!apiKey) {
    throw new Error('NEYNAR_API_KEY missing (required when using NEYNAR_SIGNER_UUID)');
  }

  const body: Record<string, unknown> = {
    signer_uuid: signerUuid,
    text: input.text,
    embeds: (input.embeds ?? []).map((url) => ({ url })),
  };
  if (input.channelKey) {
    body.channel_id = input.channelKey;
  }

  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as NeynarCastResponse;
  if (!res.ok) {
    throw new Error(
      `Neynar publish_cast ${res.status}: ${data.message ?? JSON.stringify(data)}`,
    );
  }
  return { hash: data.cast?.hash ?? '(unknown)', backend: 'neynar' };
}

// ----- Router -----

export async function publishCast(input: PublishCastInput): Promise<PublishCastResult> {
  if (process.env.ZABAL_SIGNER_PRIVATE_KEY && process.env.ZABAL_FID) {
    return publishViaHaatz(input);
  }
  if (process.env.NEYNAR_SIGNER_UUID) {
    return publishViaNeynar(input);
  }
  throw new Error(
    'No signer configured. Set either ZABAL_FID + ZABAL_SIGNER_PRIVATE_KEY ' +
      '(HAATZ direct, pure path) OR NEYNAR_SIGNER_UUID (Neynar managed, ' +
      'easy path). Run `npx tsx scripts/generate-zabal-signer.ts` to set up.',
  );
}
