// Direct Farcaster Hub publishing - no Neynar dependency.
//
// Constructs a CastAdd message, signs it with the ZABAL signer
// (Ed25519, registered on Optimism KeyGateway), and submits to a
// Snapchain Hub via HTTP POST /v1/submitMessage. Defaults to HAATZ
// (haatz.quilibrium.com) which proxies Hypersnap, fully aligned
// with Quilibrium / casie's farcasterorg federation.
//
// Required env:
//   ZABAL_FID                  - integer FID of the ZABAL Farcaster account
//   ZABAL_SIGNER_PRIVATE_KEY   - hex-encoded 32-byte Ed25519 private key,
//                                already approved on KeyGateway for ZABAL_FID
//   ZABAL_HUB_URL              - optional, defaults to https://haatz.quilibrium.com
//
// One-time setup: `npx tsx scripts/generate-zabal-signer.ts` produces
// the keypair + Warpcast approval instructions. See that script for
// the full flow.

import {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message,
  type CastAddBody,
} from '@farcaster/hub-nodejs';

const DEFAULT_HUB = 'https://haatz.quilibrium.com';
// Canonical parentUrl for the /zao channel on Warpcast. Routes the
// cast to the channel feed in addition to the author's followers.
const ZAO_CHANNEL_PARENT_URL = 'https://warpcast.com/~/channel/zao';

export interface PublishCastInput {
  text: string;
  embeds?: string[];
  /** Channel name (e.g. 'zao'). Maps to the Warpcast parentUrl. */
  channelKey?: string;
}

export interface PublishCastResult {
  hash: string;
  fid: number;
  hubUrl: string;
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
  // Generic Warpcast channel URL pattern. Channels on Farcaster are
  // identified by parentUrl - the Warpcast URL is the de facto canonical.
  return `https://warpcast.com/~/channel/${channelKey}`;
}

export async function publishCast(input: PublishCastInput): Promise<PublishCastResult> {
  const fidStr = process.env.ZABAL_FID;
  const privHex = process.env.ZABAL_SIGNER_PRIVATE_KEY;
  const hubUrl = process.env.ZABAL_HUB_URL || DEFAULT_HUB;

  if (!fidStr || !privHex) {
    throw new Error('ZABAL_FID or ZABAL_SIGNER_PRIVATE_KEY env var missing');
  }
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
    type: 0, // CastType.CAST (top-level cast, not a long cast)
    ...(input.channelKey
      ? { parentUrl: parentUrlForChannel(input.channelKey) }
      : {}),
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
    throw new Error(`Hub submit ${res.status}: ${errBody.slice(0, 200)}`);
  }

  // The hub returns the merged Message; the hash is on castMessage already
  const hash = castMessage.hash ? `0x${bytesToHex(castMessage.hash)}` : '(unknown)';
  return { hash, fid, hubUrl };
}
