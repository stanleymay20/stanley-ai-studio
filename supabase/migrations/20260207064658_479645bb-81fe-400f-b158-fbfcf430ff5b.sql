
-- Add notebook/demo fields to projects table for recruiter-friendly code demos
ALTER TABLE public.projects
ADD COLUMN notebook_url text NULL,
ADD COLUMN demo_type text NULL DEFAULT NULL;

-- Add a check constraint for valid demo_type values
ALTER TABLE public.projects
ADD CONSTRAINT projects_demo_type_check CHECK (demo_type IS NULL OR demo_type IN ('notebook', 'live_demo'));
