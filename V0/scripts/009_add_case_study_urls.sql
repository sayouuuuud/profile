-- Add website_url and video_url columns to case_studies table
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update the 'imam-streaming-platform' case study with placeholder URLs given the request context
UPDATE public.case_studies
SET
  website_url = 'https://imam-media.com',
  video_url = 'https://res.cloudinary.com/demo/video/upload/v1687518973/samples/elephants.mp4' -- Placeholder video
WHERE slug = 'imam-streaming-platform';
