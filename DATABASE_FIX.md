# CRITICAL DATABASE FIX REQUIRED

## Problem

The database has a constraint `unique_fid_per_day` that only allows **ONE vote per user per day total**, not one vote per mode per day.

This prevents multi-mode voting from working. When a user tries to vote for multiple modes:
- First vote (studio) → ❌ Fails with "duplicate key value violates unique constraint"
- Second vote (market) → ❌ Fails with "duplicate key value violates unique constraint"  
- Third vote (social) → ✅ Succeeds (replaces previous vote)
- Fourth vote (battle) → ❌ Fails with "duplicate key value violates unique constraint"

Only ONE vote survives in the database.

## Solution

The database constraint needs to be changed from:
```sql
-- WRONG (current):
UNIQUE(fid, vote_date)  -- Only allows 1 vote per user per day

-- CORRECT (needed):
UNIQUE(fid, vote_date, mode)  -- Allows 1 vote per mode per user per day
```

## Migration SQL

Run this in your Supabase SQL editor:

```sql
-- 1. Drop the incorrect constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS unique_fid_per_day;

-- 2. Add the correct constraint
ALTER TABLE votes ADD CONSTRAINT unique_fid_mode_per_day 
    UNIQUE (fid, vote_date, mode);

-- 3. Verify the constraint
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'votes'::regclass;
```

## Verification

After running the migration, test by voting for multiple modes:

1. Vote for Studio → Should succeed
2. Vote for Market → Should succeed  
3. Vote for Social → Should succeed
4. Vote for Battle → Should succeed

All 4 votes should be stored in the database.

## Current State

The code is already correct (it tries to delete by mode before inserting). The database schema is the only thing that needs to be fixed.

Once this migration is run, multi-vote will work correctly.
