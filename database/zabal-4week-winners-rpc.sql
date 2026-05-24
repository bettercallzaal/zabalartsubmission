-- Last 4 completed weeks' winning modes for the ZABAL hub.
-- Used by the Past4WeeksSparkline above the leaderboard to show
-- week-over-week momentum ("Music has won 3 of 4 lately").
--
-- Returns AT MOST 4 rows, ordered oldest-first (week ASC) so the
-- sparkline reads left-to-right chronologically. Weeks with zero
-- votes are omitted - so a freshly-launched hub may return 0-3 rows.
--
-- Idempotent. Run in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION get_zabal_4week_winners()
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
BEGIN
  v_this_week := get_current_zabal_voting_week();

  RETURN QUERY
    WITH past_weeks AS (
      -- 4 completed weeks: 1, 2, 3, 4 weeks before the current one
      SELECT (v_this_week - (n || ' days')::INTERVAL)::DATE AS week_start
        FROM generate_series(7, 28, 7) AS n
    ),
    weekly_totals AS (
      SELECT pw.week_start                              AS week,
             v.mode                                     AS mode,
             COUNT(*)::BIGINT                           AS vote_count,
             COALESCE(SUM(v.vote_power), 0)::BIGINT    AS total_power
        FROM past_weeks pw
        JOIN zabal_votes v
          ON v.voted_at >= pw.week_start
         AND v.voted_at <  pw.week_start + INTERVAL '7 days'
       GROUP BY pw.week_start, v.mode
    ),
    weekly_grand AS (
      SELECT week, SUM(total_power) AS sum_power
        FROM weekly_totals
       GROUP BY week
    ),
    ranked AS (
      SELECT t.week,
             t.mode,
             t.vote_count,
             t.total_power,
             CASE WHEN g.sum_power > 0
                  THEN ROUND(t.total_power::NUMERIC * 100 / g.sum_power)::INTEGER
                  ELSE 0
              END                                       AS win_pct,
             ROW_NUMBER() OVER (
               PARTITION BY t.week
               ORDER BY t.total_power DESC, t.vote_count DESC, t.mode ASC
             ) AS rn
        FROM weekly_totals t
        JOIN weekly_grand g USING (week)
    )
    SELECT r.week, r.mode, r.vote_count, r.total_power, r.win_pct
      FROM ranked r
     WHERE r.rn = 1
     ORDER BY r.week ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_zabal_4week_winners() TO anon, authenticated;
