import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface SiteSettings {
  id: string;
  font_heading: string;
  font_body: string;
  navigation_items: NavigationItem[];
  footer_tagline: string;
  footer_availability: string;
  footer_copyright: string;
  footer_quick_links: NavigationItem[];
  social_github: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  social_email: string | null;
  site_title: string;
  site_description: string;
  og_image_url: string | null;
  location: string;
}

const defaultSettings: Omit<SiteSettings, 'id'> = {
  font_heading: 'Inter',
  font_body: 'Inter',
  navigation_items: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Courses', href: '/courses' },
    { label: 'Contact', href: '#contact' },
  ],
  footer_tagline: 'Data Scientist & AI Engineer passionate about building intelligent systems that solve real-world problems.',
  footer_availability: 'Open to working-student and internship roles in AI and data',
  footer_copyright: 'All rights reserved.',
  footer_quick_links: [
    { label: 'Projects', href: '/projects' },
    { label: 'Courses', href: '/courses' },
    { label: 'Books', href: '/books' },
    { label: 'Contact', href: '#contact' },
  ],
  social_github: null,
  social_linkedin: null,
  social_twitter: null,
  social_email: null,
  site_title: 'Stanley Osei-Wusu | AI Engineer & Data Scientist',
  site_description: 'AI Engineer & Data Scientist portfolio showcasing machine learning projects.',
  og_image_url: null,
  location: 'Brandenburg an der Havel · Berlin, Germany',
};

// Available Google Fonts for selection
export const availableFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Nunito',
  'Ubuntu',
  'Rubik',
  'Work Sans',
  'DM Sans',
  'Space Grotesk',
  'IBM Plex Sans',
  'Outfit',
  'Sora',
  'Plus Jakarta Sans',
];

export function useSiteSettings() {
  const { data: settings = { id: '', ...defaultSettings }, isPending: loading, error, refetch } = useQuery({
    queryKey: ['public-site-settings'],
    queryFn: async ({ signal }): Promise<SiteSettings> => {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).abortSignal(signal).maybeSingle();
      if (error) throw error;
      if (!data) return { id: '', ...defaultSettings };
      return {
        ...defaultSettings, ...data,
        navigation_items: Array.isArray(data.navigation_items) ? data.navigation_items : defaultSettings.navigation_items,
        footer_quick_links: Array.isArray(data.footer_quick_links) ? data.footer_quick_links : defaultSettings.footer_quick_links,
      } as SiteSettings;
    },
    placeholderData: { id: '', ...defaultSettings },
    staleTime: 60_000,
    retry: false,
  });

  const fontHeading = settings.font_heading;
  const fontBody = settings.font_body;
  // Apply fonts to document
  useEffect(() => {
    {
      // Load Google Fonts dynamically
      const fonts = [fontHeading, fontBody].filter((f, i, arr) => arr.indexOf(f) === i);
      const link = document.getElementById('google-fonts-link') as HTMLLinkElement;
      
      if (link) {
        const fontQuery = fonts.map(f => `${encodeURIComponent(f)}:wght@400;500;600;700`).join('&family=');
        link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
      } else {
        const newLink = document.createElement('link');
        newLink.id = 'google-fonts-link';
        newLink.rel = 'stylesheet';
        const fontQuery = fonts.map(f => `${encodeURIComponent(f)}:wght@400;500;600;700`).join('&family=');
        newLink.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
        document.head.appendChild(newLink);
      }

      // Apply CSS variables
      document.documentElement.style.setProperty('--font-heading', `"${fontHeading}", system-ui, sans-serif`);
      document.documentElement.style.setProperty('--font-body', `"${fontBody}", system-ui, sans-serif`);
    }
  }, [fontHeading, fontBody]);

  return { settings, loading, error: error?.message ?? null, refetch };
}

// Admin hook for updating settings
export function useAdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async (adminSecret: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'list', table: 'site_settings', secret: adminSecret }
      });

      if (error) throw error;
      
      if (data?.data?.[0]) {
        const row = data.data[0];
        setSettings({
          ...row,
          navigation_items: Array.isArray(row.navigation_items) ? row.navigation_items : [],
          footer_quick_links: Array.isArray(row.footer_quick_links) ? row.footer_quick_links : [],
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (adminSecret: string, updates: Partial<SiteSettings>) => {
    if (!settings?.id) return false;
    
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'update', 
          table: 'site_settings', 
          id: settings.id,
          data: updates,
          secret: adminSecret 
        }
      });

      if (error) throw error;
      
      setSettings(prev => prev ? { ...prev, ...updates } : prev);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings?.id]);

  return { settings, setSettings, loading, saving, fetchSettings, updateSettings };
}
