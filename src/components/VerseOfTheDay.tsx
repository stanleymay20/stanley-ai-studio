import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Verse {
  verse_text: string;
  reference: string;
  reflection?: string | null;
}

interface VerseSettings {
  enabled: boolean;
  show_reflection: boolean;
  placement: string;
}

interface VerseOfTheDayProps {
  placement?: 'homepage' | 'footer';
  className?: string;
}

export const VerseOfTheDay = ({ placement = 'homepage', className }: VerseOfTheDayProps) => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [settings, setSettings] = useState<VerseSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerseAndSettings = async () => {
      try {
        // Fetch settings
        const { data: settingsData } = await supabase
          .from('verse_settings')
          .select('*')
          .limit(1)
          .single();

        if (settingsData) {
          setSettings({
            enabled: settingsData.enabled ?? true,
            show_reflection: settingsData.show_reflection ?? false,
            placement: settingsData.placement ?? 'homepage',
          });

          // Only fetch verse if enabled and placement matches
          if (settingsData.enabled && settingsData.placement === placement) {
            const { data: verseData, error: verseError } = await supabase
              .from('verses')
              .select('verse_text, reference, reflection')
              .eq('is_active', true)
              .limit(1)
              .maybeSingle(); // Use maybeSingle() to avoid 406 error when no active verse exists

            if (!verseError && verseData) {
              setVerse(verseData);
            }
          }
        }
      } catch (error) {
        console.log('Verse fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerseAndSettings();
  }, [placement]);

  // Don't render if loading, disabled, or wrong placement
  if (loading || !settings?.enabled || settings.placement !== placement || !verse) {
    return null;
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Book className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Verse of the Day</span>
        </div>

        {/* Verse */}
        <blockquote className="space-y-4">
          <p className="text-lg md:text-xl font-serif italic text-foreground leading-relaxed">
            "{verse.verse_text}"
          </p>
          <footer className="text-sm font-medium text-primary">
            — {verse.reference}
          </footer>
        </blockquote>

        {/* Reflection (optional) */}
        {settings.show_reflection && verse.reflection && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {verse.reflection}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
