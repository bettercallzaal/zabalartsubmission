const NEYNAR_BASE = 'https://api.neynar.com/v2/farcaster';
const READ_BASE = process.env.FARCASTER_READ_API_BASE
  ? `${process.env.FARCASTER_READ_API_BASE}/v2/farcaster`
  : NEYNAR_BASE;

function headers() {
  return {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEYNAR_API_KEY || '',
  };
}

/** Headers for read requests - omit API key when using free Hypersnap proxy */
function readHeaders() {
  if (process.env.FARCASTER_READ_API_BASE) {
    return { 'Content-Type': 'application/json' };
  }
  return headers();
}

/** Fetch with failover: try READ_BASE first, fall back to NEYNAR_BASE on error */
async function fetchWithFailover(path: string, init: RequestInit): Promise<Response> {
  if (READ_BASE === NEYNAR_BASE) {
    return fetch(`${NEYNAR_BASE}${path}`, init);
  }
  try {
    const res = await fetch(`${READ_BASE}${path}`, init);
    if (res.ok) return res;
  } catch {
    // Network error from proxy - fall back to Neynar
  }
  return fetch(`${NEYNAR_BASE}${path}`, {
    ...init,
    headers: headers(),
  });
}

export async function getUserByFid(fid: number, viewerFid?: number) {
  const params = new URLSearchParams({ fid: String(fid) });
  if (viewerFid) params.set('viewer_fid', String(viewerFid));

  const res = await fetchWithFailover(`/user/by_fid?${params}`, {
    headers: readHeaders(),
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Neynar getUserByFid error ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function getUsersByFids(fids: number[]) {
  const params = new URLSearchParams({ fids: fids.join(',') });

  const res = await fetchWithFailover(`/user/bulk?${params}`, {
    headers: readHeaders(),
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Neynar getUsersByFids error ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function getUserCasts(fid: number, limit = 100) {
  const params = new URLSearchParams({
    fid: String(fid),
    limit: String(limit),
  });

  const res = await fetchWithFailover(`/casts?${params}`, {
    headers: readHeaders(),
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Neynar getUserCasts error ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function getNeynarUserScore(fid: number): Promise<number | null> {
  try {
    const res = await fetchWithFailover(`/user/by_fid?fid=${fid}`, {
      headers: readHeaders(),
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.neynar_score ?? null;
  } catch {
    return null;
  }
}
