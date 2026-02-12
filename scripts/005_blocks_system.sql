-- Add content_blocks JSONB column to case_studies
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;
