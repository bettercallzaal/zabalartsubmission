-- Check all constraints on the votes table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'votes'::regclass
ORDER BY conname;

-- If you see BOTH of these constraints:
-- 1. unique_fid_per_day (WRONG - blocks multi-vote)
-- 2. unique_fid_mode_per_day (CORRECT - allows multi-vote)

-- Then run this to remove the duplicate:
-- ALTER TABLE votes DROP CONSTRAINT IF EXISTS unique_fid_per_day;
