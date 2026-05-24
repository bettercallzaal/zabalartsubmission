/**
 * ZABAL Farcaster signer setup - dual path.
 *
 * Two ways to authorize the daily ZABAL cron cast to post on behalf
 * of the Zaal-owned Farcaster account (bettercallzaal by default):
 *
 *   A) Neynar managed signer (default, ~5 min, recommended)
 *      - Neynar generates + holds the keypair
 *      - You tap Approve in Warpcast on your phone
 *      - Daily cron uses Neynar publish_cast for the WRITE
 *      - Reads still go through HAATZ via existing FARCASTER_READ_API_BASE
 *      - Requires: NEYNAR_API_KEY (already set for vote-power lookup)
 *
 *   B) Pure HAATZ + manual KeyGateway.add() on Optimism (--quilibrium flag)
 *      - This script generates the keypair locally (you keep the private key)
 *      - You sign + submit a SignedKeyRequest on Optimism via Etherscan
 *        with the custody EOA that owns the FID
 *      - Daily cron uses HAATZ /v1/submitMessage with your locally-stored
 *        signer - zero Neynar surface for writes
 *      - More setup work, no vendor lock-in
 *
 * Usage:
 *   npx tsx scripts/generate-zabal-signer.ts          # default = Neynar path
 *   npx tsx scripts/generate-zabal-signer.ts --quilibrium   # pure path
 */

import { NobleEd25519Signer } from '@farcaster/hub-nodejs';
import { randomBytes } from 'node:crypto';

const ARG_QUILIBRIUM = process.argv.includes('--quilibrium');

// EIP-712 contract constants (Farcaster mainnet on Optimism)
const KEY_GATEWAY_ADDRESS = '0x00000000Fc56947c7E7183f8Ca4B62398CaAdf0B';
const SIGNED_KEY_REQUEST_VALIDATOR = '0x00000000FC700472606ED4fA22623Acf62c60553';

async function generateLocalKeypair() {
  const privateKey = randomBytes(32);
  const signer = new NobleEd25519Signer(privateKey);
  const pubResult = await signer.getSignerKey();
  if (pubResult.isErr()) {
    console.error('Failed to derive public key:', pubResult.error);
    process.exit(1);
  }
  const pubKey = pubResult.value;
  return {
    privateKeyHex: Buffer.from(privateKey).toString('hex'),
    publicKeyHex: `0x${Buffer.from(pubKey).toString('hex')}`,
  };
}

// =================================================================
// PATH A - Neynar managed signer
// =================================================================

async function pathNeynar() {
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    console.error('NEYNAR_API_KEY not set. Either set it (already needed for');
    console.error('vote-power Neynar score lookup) or run with --quilibrium');
    console.error('for the pure on-chain path.');
    process.exit(1);
  }

  console.log('==========================================');
  console.log('  PATH A - Neynar managed signer (default)');
  console.log('==========================================');
  console.log('');
  console.log('Creating managed signer at Neynar...');

  const res = await fetch('https://api.neynar.com/v2/farcaster/signer', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`Neynar signer create failed (${res.status}): ${body.slice(0, 200)}`);
    process.exit(1);
  }
  const data = (await res.json()) as {
    signer_uuid: string;
    public_key: string;
    status: string;
    signer_approval_url?: string;
  };

  console.log('');
  console.log('Signer created. Now register the approval URL...');

  // Step 2: register signed key request to get the approval URL
  const reg = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signer_uuid: data.signer_uuid,
    }),
  });
  if (!reg.ok) {
    const body = await reg.text().catch(() => '');
    console.error(`Neynar signed_key failed (${reg.status}): ${body.slice(0, 200)}`);
    console.error('You can still complete approval manually if the signer was created.');
    console.error('signer_uuid:', data.signer_uuid);
    process.exit(1);
  }
  const regData = (await reg.json()) as { signer_approval_url: string };

  console.log('');
  console.log('==========================================');
  console.log('  Setup complete - 3 things to do');
  console.log('==========================================');
  console.log('');
  console.log('1. OPEN THIS URL ON YOUR PHONE (must be logged into Warpcast');
  console.log('   as the account that should publish the cast - your call:');
  console.log('   @bettercallzaal or @thezao):');
  console.log('');
  console.log('   ' + regData.signer_approval_url);
  console.log('');
  console.log('   Tap APPROVE in Warpcast. Done.');
  console.log('');
  console.log('2. Set these env vars in Vercel project settings:');
  console.log('     NEYNAR_SIGNER_UUID = ' + data.signer_uuid);
  console.log('');
  console.log('   (NEYNAR_API_KEY is already set; nothing else to change.)');
  console.log('');
  console.log('3. Verify the cron route fires:');
  console.log('     curl -H "Authorization: Bearer $CRON_SECRET" \\');
  console.log('          https://zabal.art/api/cron/zabal-daily-cast');
  console.log('');
  console.log('Daily cron will publish via Neynar (uses your approved');
  console.log('signer to post as the account you tapped Approve from).');
  console.log('Reads still go through HAATZ free. ~$0/month at free tier.');
  console.log('');
  console.log('To rotate or revoke: Warpcast -> Settings -> Connected Apps');
  console.log('-> find Neynar -> Remove. Done.');
}

// =================================================================
// PATH B - Pure Quilibrium / HAATZ on-chain registration
// =================================================================

async function pathQuilibrium() {
  const { privateKeyHex, publicKeyHex } = await generateLocalKeypair();

  console.log('==========================================');
  console.log('  PATH B - Pure HAATZ via on-chain register');
  console.log('==========================================');
  console.log('');
  console.log('PUBLIC KEY (32 bytes, will be registered on Optimism):');
  console.log('  ' + publicKeyHex);
  console.log('');
  console.log('PRIVATE KEY (KEEP SECRET - set as ZABAL_SIGNER_PRIVATE_KEY env):');
  console.log('  ' + privateKeyHex);
  console.log('');
  console.log('==========================================');
  console.log('  Manual on-chain approval (advanced, ~15 min)');
  console.log('==========================================');
  console.log('');
  console.log('You need to call KeyGateway.add() on Optimism from the');
  console.log('custody EOA that owns the Farcaster account.');
  console.log('');
  console.log('KeyGateway contract (Optimism mainnet):');
  console.log('  ' + KEY_GATEWAY_ADDRESS);
  console.log('');
  console.log('SignedKeyRequestValidator contract:');
  console.log('  ' + SIGNED_KEY_REQUEST_VALIDATOR);
  console.log('');
  console.log('Step-by-step:');
  console.log('');
  console.log('  1. Build a SignedKeyRequest EIP-712 payload signed by your');
  console.log('     custody EOA. Easiest with viem or a hardhat script:');
  console.log('');
  console.log('     domain: {');
  console.log('       name: "Farcaster SignedKeyRequestValidator",');
  console.log('       version: "1",');
  console.log('       chainId: 10,  // Optimism');
  console.log('       verifyingContract: "' + SIGNED_KEY_REQUEST_VALIDATOR + '"');
  console.log('     }');
  console.log('     types: { SignedKeyRequest: [');
  console.log('       { name: "requestFid", type: "uint256" },');
  console.log('       { name: "key", type: "bytes" },');
  console.log('       { name: "deadline", type: "uint256" }');
  console.log('     ]}');
  console.log('     message: {');
  console.log('       requestFid: <your-FID>,');
  console.log('       key: "' + publicKeyHex + '",');
  console.log('       deadline: <unix-timestamp-1-hour-from-now>');
  console.log('     }');
  console.log('');
  console.log('  2. Encode the metadata tuple:');
  console.log('     abi.encode(requestFid, requestSigner, signature, deadline)');
  console.log('     where requestSigner = your custody EOA address');
  console.log('');
  console.log('  3. Call KeyGateway.add(1, key, 1, metadata) from your');
  console.log('     custody EOA on Optimism. Pay gas (~$0.001).');
  console.log('     Can be done via Etherscan write-contract UI:');
  console.log('     https://optimistic.etherscan.io/address/' + KEY_GATEWAY_ADDRESS + '#writeContract');
  console.log('');
  console.log('  4. Set in Vercel env:');
  console.log('     ZABAL_FID                = <your FID>');
  console.log('     ZABAL_SIGNER_PRIVATE_KEY = ' + privateKeyHex);
  console.log('     ZABAL_HUB_URL            = https://haatz.quilibrium.com');
  console.log('');
  console.log('  5. Verify:');
  console.log('     curl -H "Authorization: Bearer $CRON_SECRET" \\');
  console.log('          https://zabal.art/api/cron/zabal-daily-cast');
  console.log('');
  console.log('==========================================');
  console.log('  Honest tradeoff');
  console.log('==========================================');
  console.log('');
  console.log('This path is ~15 min of EIP-712 + Etherscan work vs 1 minute');
  console.log('with --neynar (default). Both end states have the same security');
  console.log('properties; the difference is just whether Neynar OR the script');
  console.log('holds the signer private key.');
  console.log('');
  console.log('If you want a hand-holding browser helper for the EIP-712 sign,');
  console.log('ask Claude to ship a /signer-approval helper page - estimated');
  console.log('4-8 hours of frontend work using viem + wagmi.');
}

async function main() {
  if (ARG_QUILIBRIUM) {
    await pathQuilibrium();
  } else {
    await pathNeynar();
  }
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
