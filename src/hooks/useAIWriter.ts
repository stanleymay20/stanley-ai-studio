import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AIAction = 'write_description' | 'improve' | 'professional' | 'shorten' | 'seo_summary' | 'write_bio';

interface AIContext {
  type?: string;
  techStack?: string;
  category?: string;
}

export function useAIWriter() {
  const [loading, setLoading] = useState(false);

  const generateText = async (
    action: AIAction,
    content: string,
    context?: AIContext
  ): Promise<string | null> => {
    if (!content.trim()) {
      toast({
        title: 'Missing input',
        description: 'Please provide some content first',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-writer', {
        body: { action, content, context }
      });

      if (error) throw error;
      
      if (data.error) {
        toast({
          title: 'AI Error',
          description: data.error,
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: '✨ Text generated',
        description: 'AI has improved your content',
      });

      return data.text;
    } catch (error) {
      console.error('AI Writer error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate text. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateText, loading };
}
