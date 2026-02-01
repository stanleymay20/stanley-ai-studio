-- Add recruiter-focused fields to profile table
ALTER TABLE public.profile
ADD COLUMN IF NOT EXISTS role_title TEXT DEFAULT 'AI Engineer & Data Scientist',
ADD COLUMN IF NOT EXISTS value_proposition TEXT DEFAULT 'I build production-ready AI systems, data pipelines, and automation tools that deliver measurable business impact.',
ADD COLUMN IF NOT EXISTS core_skills TEXT[] DEFAULT ARRAY['Python', 'Machine Learning', 'NLP', 'SQL', 'Data Pipelines', 'Cloud (AWS/GCP)', 'APIs', 'TensorFlow'],
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profile.role_title IS 'Recruiter-facing role title for summary';
COMMENT ON COLUMN public.profile.value_proposition IS 'One-line value proposition for recruiters';
COMMENT ON COLUMN public.profile.core_skills IS 'ATS-friendly skill keywords';
COMMENT ON COLUMN public.profile.resume_url IS 'URL to downloadable resume PDF';