-- Profile table (single row for owner)
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Stanley Osei-Wusu',
  title TEXT NOT NULL DEFAULT 'AI Engineer | Data Scientist | Entrepreneur',
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  career JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  memberships JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT DEFAULT 'AI',
  tech_stack TEXT[] DEFAULT '{}',
  external_link TEXT,
  github_link TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  external_link TEXT,
  status TEXT DEFAULT 'draft',
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin settings table (stores admin secret hash)
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for profile, projects, published books/videos
CREATE POLICY "Public can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Public can view published books" ON public.books FOR SELECT USING (published = true);
CREATE POLICY "Public can view published videos" ON public.videos FOR SELECT USING (published = true);

-- Service role has full access (for admin operations via edge functions)
CREATE POLICY "Service role full access profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access books" ON public.books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access videos" ON public.videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default profile data
INSERT INTO public.profile (name, title, bio, email, linkedin, github, education, career, languages, skills, memberships) VALUES (
  'Stanley Osei-Wusu',
  'AI Engineer | Data Scientist | Entrepreneur',
  'I am a Data Scientist and AI Engineer passionate about building scroll-aligned AI systems that solve global challenges in education, justice, and business intelligence. I combine academic research with hands-on entrepreneurship to create scalable, impactful solutions.',
  'stanleymay20@gmail.com',
  'linkedin.com/in/stanleyoseiwusu',
  'github.com/stanleyoseiwusu',
  '[{"degree": "BSc Data Science, AI & Digital Business", "institution": "GISMA University of Applied Sciences, Germany", "period": "2021–2025", "thesis": "Predicting Technological Shifts in Germany''s Manufacturing"}]'::jsonb,
  '[{"title": "Co-founder", "company": "ScrollIntel", "description": "Enterprise AI Platform", "period": "2024–present", "current": true}, {"title": "Student Assistant", "company": "GISMA Business School", "description": "", "period": "2022–2024", "current": false}]'::jsonb,
  '[{"language": "English", "level": "Fluent"}, {"language": "German", "level": "Intermediate"}, {"language": "Twi", "level": "Native"}]'::jsonb,
  '["Python", "Machine Learning", "Deep Learning", "NLP", "React", "FastAPI", "GCP", "AI Agents"]'::jsonb,
  '[{"title": "Member, German Data Science Society"}, {"title": "Certified in Machine Learning (Coursera)"}]'::jsonb
);

-- Insert default projects
INSERT INTO public.projects (title, subtitle, description, tech_stack, featured, published, sort_order) VALUES
('ScrollIntel™', 'Enterprise AI Platform', 'Full-stack AI system replacing CTO & data science functions with autonomous agents, BI dashboards, and AI-generated visual content.', ARRAY['Python', 'FastAPI', 'React', 'GCP', 'AI Agents'], true, true, 1),
('AI Resume Screener', 'NLP Project', 'Natural language processing system to automatically screen job applicants with 87% accuracy.', ARRAY['Python', 'spaCy', 'scikit-learn', 'Streamlit'], false, true, 2),
('ScrollUniversity', 'AI-Powered Learning Platform', 'A scroll-governed education system with 26 AI specs, supporting autonomous learning and authorship validation.', ARRAY['AI Agents', 'Next.js', 'Tailwind', 'Google Cloud'], false, true, 3);