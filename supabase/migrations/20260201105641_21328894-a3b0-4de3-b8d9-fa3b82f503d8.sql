-- Create site_settings table for storing all customizable site options
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Typography
  font_heading text DEFAULT 'Inter',
  font_body text DEFAULT 'Inter',
  
  -- Navigation items (array of {label, href})
  navigation_items jsonb DEFAULT '[
    {"label": "Home", "href": "#home"},
    {"label": "Projects", "href": "#projects"},
    {"label": "About", "href": "#about"},
    {"label": "Contact", "href": "#contact"}
  ]'::jsonb,
  
  -- Footer content
  footer_tagline text DEFAULT 'Data Scientist & AI Engineer passionate about building intelligent systems that solve real-world problems.',
  footer_availability text DEFAULT 'Available for freelance projects',
  footer_copyright text DEFAULT 'All rights reserved.',
  footer_quick_links jsonb DEFAULT '[
    {"label": "Projects", "href": "#projects"},
    {"label": "About", "href": "#about"},
    {"label": "Blog", "href": "#blog"},
    {"label": "Contact", "href": "#contact"}
  ]'::jsonb,
  
  -- Social links (used in footer)
  social_github text DEFAULT NULL,
  social_linkedin text DEFAULT NULL,
  social_twitter text DEFAULT NULL,
  social_email text DEFAULT NULL,
  
  -- SEO & Branding
  site_title text DEFAULT 'Stanley Osei-Wusu | AI Engineer & Data Scientist',
  site_description text DEFAULT 'AI Engineer & Data Scientist portfolio showcasing machine learning projects, data science expertise, and production-ready AI systems.',
  og_image_url text DEFAULT NULL,
  
  -- Location (shown in profile)
  location text DEFAULT 'Based in Potsdam',
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Service role full access
CREATE POLICY "Service role full access site_settings" 
ON public.site_settings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());