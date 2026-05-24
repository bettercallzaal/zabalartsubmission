/**
 * One-time ZABAL signer generation + approval helper.
 *
 * Generates an Ed25519 keypair for the ZABAL Farcaster account to use
 * as its posting signer. Prints the public key in the format required
 * for Warpcast's "Add Custom Signer" flow + on-chain registration via
 * the KeyGateway contract on Optimism.
 *
 * Run with:
 *   npx tsx scripts/generate-zabal-signer.ts
 *
 * After running:
 * 1. Approve the printed public key for the ZABAL Farcaster account
 *    (one of three paths):
 *
 *    a) Warpcast UI (easiest):
 *       Settings -> Verified Addresses -> Add Custom Signer ->
 *       paste the public key, sign with the account that owns
 *       ZABAL's FID. Costs nothing beyond network gas.
 *
 *    b) Programmatic via SIWF requestKey + approval frame
 *       (skip until we need multiple signers - one is enough).
 *
 *    c) Direct on-chain via KeyGateway.add() on Optimism
 *       (advanced - requires owning the ZABAL custody key).
 *
 * 2. Set these env vars in Vercel (Project Settings -> Env Vars):
 *      ZABAL_FID                = <integer FID of ZABAL account>
 *      ZABAL_SIGNER_PRIVATE_KEY = <printed below, KEEP SECRET>
 *      ZABAL_HUB_URL            = https://haatz.quilibrium.com (default)
 *
 * 3. Set CRON_SECRET if not already set.
 *
 * 4. Trigger the daily cast manually to verify:
 *      curl -H "Authorization: Bearer $CRON_SECRET" \
 *           https://zabal.art/api/cron/zabal-daily-cast
 *
 * SECURITY: The private key is full posting authority for ZABAL until
 * revoked. Never commit it. Never log it after this script. If it leaks,
 * revoke via KeyGateway.remove() on Optimism + generate a new one.
 */

import { NobleEd25519Signer } from '@farcaster/hub-nodejs';
import { randomBytes } from 'node:crypto';

async function main() {
  // Generate a fresh 32-byte Ed25519 private key
  const privateKey = randomBytes(32);
  const signer = new NobleEd25519Signer(privateKey);
  const pubKeyResult = await signer.getSignerKey();
  if (pubKeyResult.isErr()) {
    console.error('Failed to derive public key:', pubKeyResult.error);
    process.exit(1);
  }
  const pubKey = pubKeyResult.value;

  const privHex = Buffer.from(privateKey).toString('hex');
  const pubHex = `0x${Buffer.from(pubKey).toString('hex')}`;

  console.log('==========================================');
  console.log('  ZABAL Farcaster signer keypair generated');
  console.log('==========================================');
  console.log('');
  console.log('PUBLIC KEY (approve this on Farcaster):');
  console.log('  ' + pubHex);
  console.log('');
  console.log('PRIVATE KEY (set as ZABAL_SIGNER_PRIVATE_KEY env var):');
  console.log('  ' + privHex);
  console.log('');
  console.log('==========================================');
  console.log('  Next steps');
  console.log('==========================================');
  console.log('');
  console.log('1. Approve the PUBLIC KEY for the ZABAL account on Farcaster.');
  console.log('   Easiest path: Warpcast Settings -> Add Custom Signer ->');
  console.log('   paste the pubkey, sign with the ZABAL custody wallet.');
  console.log('');
  console.log('2. Set these env vars in Vercel:');
  console.log('     ZABAL_FID                = <integer FID of ZABAL account>');
  console.log('     ZABAL_SIGNER_PRIVATE_KEY = ' + privHex);
  console.log('     ZABAL_HUB_URL            = https://haatz.quilibrium.com');
  console.log('');
  console.log('3. Trigger the daily cast manually to verify:');
  console.log('     curl -H "Authorization: Bearer $CRON_SECRET" \\');
  console.log('          https://zabal.art/api/cron/zabal-daily-cast');
  console.log('');
  console.log('SECURITY: never commit the private key. Revoke + rotate if leaked.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
