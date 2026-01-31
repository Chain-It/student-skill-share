-- Add new profile columns for freelancer profile
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS professional_title TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS availability_hours TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS response_time TEXT,
ADD COLUMN IF NOT EXISTS preferred_communication TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education_program TEXT,
ADD COLUMN IF NOT EXISTS education_institution TEXT,
ADD COLUMN IF NOT EXISTS education_year INTEGER,
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS portfolio_items JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_identity_verified BOOLEAN DEFAULT FALSE;

-- Create portfolio storage bucket for work samples
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for portfolio bucket
CREATE POLICY "Portfolio files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Users can upload their own portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own portfolio files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);