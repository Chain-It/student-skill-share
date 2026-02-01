-- Add education_level TEXT column to store academic level
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_level TEXT;

-- Migrate existing year data to level format (for backwards compatibility)
-- If education_year contains a 4-digit year, leave it for legacy display
-- New entries will use the level string directly