-- ==========================================
-- FIX: shoes table missing columns + RLS
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. shoes टेबल में missing columns add करें
ALTER TABLE shoes 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Premium Shoes',
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- 2. shoes टेबल पर RLS enable करें
ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;

-- 3. सभी को shoes देखने दें (Public Read)
DROP POLICY IF EXISTS "Allow public read shoes" ON shoes;
CREATE POLICY "Allow public read shoes" ON shoes
FOR SELECT USING (true);

-- 4. Admin को products add करने दें
DROP POLICY IF EXISTS "Allow admin insert shoes" ON shoes;
CREATE POLICY "Allow admin insert shoes" ON shoes
FOR INSERT WITH CHECK (true);

-- 5. Admin को products update करने दें (Stock update)
DROP POLICY IF EXISTS "Allow admin update shoes" ON shoes;
CREATE POLICY "Allow admin update shoes" ON shoes
FOR UPDATE USING (true);

-- 6. Admin को products delete करने दें
DROP POLICY IF EXISTS "Allow admin delete shoes" ON shoes;
CREATE POLICY "Allow admin delete shoes" ON shoes
FOR DELETE USING (true);

-- Refresh schema cache (important!)
NOTIFY pgrst, 'reload schema';
