-- Last completed week's winning mode for the ZABAL hub.
-- Used by /og (dynamic cast preview card) and the LastWeekBanner
-- above the vote section ("Last week: Music won 47%").
--
-- "Last week" = the 7 day window that ended at the most recent
-- America/New_York Monday 00:00. If two modes tie on total_power,
-- the higher vote_count wins; ultimate tiebreak is alphabetical
-- mode name (deterministic for cache stability).
--
-- Returns AT MOST one row. Empty result = no votes last week
-- (first ever week, or the table got wiped).
--
-- Idempotent. Run in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION get_zabal_last_weeks_winner()
RETURNS TABLE (
  week         DATE,
  mode         TEXT,
  vote_count   BIGINT,
  total_power  BIGINT,
  win_pct      INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_this_week DATE;
  v_last_week DATE;
BEGIN
  v_this_week := get_current_zabal_voting_week();
  v_last_week := v_this_week - INTERVAL '7 days';

  RETURN QUERY
    WITH last_week_totals AS (
      SELECT v.mode,
             COUNT(*)::BIGINT                              AS vote_count,
             COALESCE(SUM(v.vote_power), 0)::BIGINT        AS total_power
        FROM zabal_votes v
       WHERE v.voted_at >= v_last_week
         AND v.voted_at <  v_this_week
       GROUP BY v.mode
    ),
    grand AS (
      SELECT COALESCE(SUM(total_power), 0) AS sum_power FROM last_week_totals
    )
    SELECT v_last_week                                       AS week,
           t.mode,
           t.vote_count,
           t.total_power,
           CASE WHEN g.sum_power > 0
                THEN ROUND(t.total_power::NUMERIC * 100 / g.sum_power)::INTEGER
                ELSE 0
            END                                              AS win_pct
      FROM last_week_totals t, grand g
     ORDER BY t.total_power DESC, t.vote_count DESC, t.mode ASC
     LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION get_zabal_last_weeks_winner() TO anon, authenticated;
