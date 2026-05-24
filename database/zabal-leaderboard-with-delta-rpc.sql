-- ZABAL leaderboard with week-over-week rank deltas.
-- Returns the same fields as get_zabal_leaderboard PLUS:
--   prev_rank   - what this voter's rank was 7 days ago (NULL if new
--                 to the top of the board)
--   rank_change - prev_rank minus current rank. Positive = climbed,
--                 negative = fell, 0 = unchanged, NULL = new
--
-- Computes prev_rank inline from zabal_votes (no snapshot table needed).
-- Tiebreak: fid ASC (deterministic) added to the existing
-- total_votes DESC, streak_days DESC order, so deltas don't fluctuate
-- from non-deterministic ranking.
--
-- Idempotent. Run in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION get_zabal_leaderboard_with_delta(p_limit INTEGER DEFAULT 25)
RETURNS TABLE (
  rank         BIGINT,
  fid          INTEGER,
  username     TEXT,
  score        INTEGER,
  streak       INTEGER,
  last_vote    DATE,
  prev_rank    BIGINT,
  rank_change  INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_last_week TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  RETURN QUERY
    WITH current_ranked AS (
      -- Mirrors get_zabal_leaderboard's source + ordering; fid ASC
      -- added as final tiebreak so the ranking is deterministic
      -- (otherwise ties would produce phantom rank changes).
      SELECT ls.fid,
             ls.username,
             ls.total_votes  AS score,
             ls.streak_days  AS streak,
             ls.last_vote_date AS last_vote,
             ROW_NUMBER() OVER (
               ORDER BY ls.total_votes DESC, ls.streak_days DESC, ls.fid ASC
             ) AS rk
        FROM zabal_leaderboard_scores ls
    ),
    prev_scores AS (
      -- Recompute total_votes as of 7 days ago by counting distinct
      -- America/New_York weeks present in zabal_votes <= v_last_week.
      -- Matches the trigger logic in update_zabal_leaderboard_score().
      SELECT v.fid,
             COUNT(DISTINCT
               (DATE_TRUNC('week', v.voted_at AT TIME ZONE 'America/New_York')::DATE
                + INTERVAL '1 day')
             )::INTEGER AS score
        FROM zabal_votes v
       WHERE v.voted_at <= v_last_week
       GROUP BY v.fid
    ),
    prev_ranked AS (
      SELECT ps.fid,
             ROW_NUMBER() OVER (
               ORDER BY ps.score DESC, ps.fid ASC
             ) AS rk
        FROM prev_scores ps
    )
    SELECT cr.rk                                  AS rank,
           cr.fid,
           cr.username,
           cr.score,
           cr.streak,
           cr.last_vote,
           pr.rk                                  AS prev_rank,
           CASE WHEN pr.rk IS NULL THEN NULL
                ELSE (pr.rk - cr.rk)::INTEGER
            END                                   AS rank_change
      FROM current_ranked cr
      LEFT JOIN prev_ranked pr USING (fid)
     ORDER BY cr.rk
     LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION get_zabal_leaderboard_with_delta(INTEGER) TO anon, authenticated;
