-- First convert column to text to allow updates
ALTER TABLE public.gigs ALTER COLUMN category TYPE text;

-- Map old categories to new ones
UPDATE public.gigs SET category = 'graphics_and_design' WHERE category IN ('graphics', 'brainstorming', 'other');
UPDATE public.gigs SET category = 'presentation_design' WHERE category = 'presentations';
UPDATE public.gigs SET category = 'online_tutoring' WHERE category = 'tutoring';
UPDATE public.gigs SET category = 'cv_resume_design' WHERE category = 'resume_design';

-- Drop old enum
DROP TYPE IF EXISTS public.gig_category;

-- Create new enum with all categories
CREATE TYPE public.gig_category AS ENUM (
  'graphics_and_design',
  'video_and_animation',
  'writing_and_translation',
  'website_development',
  'social_media_marketing',
  'programming_and_tech',
  'consultations',
  'mathematics_and_physics',
  'online_tutoring',
  'packaging_and_label_design',
  'app_design',
  't_shirts_and_merchandise',
  'book_design_and_illustration',
  'music_and_audio',
  'video_ads_and_commercials',
  'video_editing',
  'ui_ux_design',
  'image_editing',
  'presentation_design',
  'blockchain_smart_contract_development',
  'study_guides',
  'proofreading',
  'cv_resume_design'
);

-- Convert back to enum
ALTER TABLE public.gigs ALTER COLUMN category TYPE public.gig_category USING category::public.gig_category;