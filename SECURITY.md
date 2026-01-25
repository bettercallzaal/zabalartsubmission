# Security Policy

## Secrets Management

### What's Safe
- **No secrets are committed to this repository**
- `.env.example` contains placeholders only
- All real API keys and tokens live in:
  - Vercel environment variables (production)
  - Local `.env` files (development, gitignored)

### Key Rotation
- Neynar API keys are rotated regularly
- All API calls are proxied through serverless functions (`/api/*`)
- No client-side API keys exist in the codebase

## Voting Integrity

### Server-Side Authority
- **All votes are enforced server-side** via Supabase RPCs
- Vote power is calculated server-side (`/api/calculate-vote-power.js`)
- Client-side gating is UX-only (not security)

### Database Security
- Row Level Security (RLS) policies enforce access control
- RPCs use `SECURITY DEFINER` to bypass client permissions safely
- Vote power is cached in `vote_power_cache` table (server-controlled)

### What Clients Cannot Do
- ❌ Manipulate vote power
- ❌ Bypass daily voting requirements
- ❌ Vote multiple times per period
- ❌ Access other users' vote data

## Rate Limiting

### Current Protections
- Frontend: 1-second cooldown between vote actions
- Database: UPSERT operations are idempotent (last write wins)
- Supabase: Built-in rate limiting on anon key

## Reporting Security Issues

If you discover a security vulnerability, please report it privately:

1. **Do not** open a public GitHub issue
2. Contact: [Your contact method here]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

We take security seriously and will respond promptly.

## Security Audit History

- **v2.0.0** (Jan 2025): Comprehensive security audit completed
  - Removed all hardcoded API keys
  - Implemented server-side vote power calculation
  - Tightened RLS policies
  - Added FID verification in RPCs
