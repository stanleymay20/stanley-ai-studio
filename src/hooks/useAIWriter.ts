import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AIAction = 
  | 'write_description' 
  | 'improve' 
  | 'professional' 
  | 'shorten' 
  | 'seo_summary' 
  | 'write_bio'
  | 'recruiter_language'
  | 'ats_optimize'
  | 'add_impact'
  | 'one_liner'
  | 'interview_points'
  | 'value_proposition'
  | 'resume_bullets';

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

      const actionLabels: Record<AIAction, string> = {
        write_description: 'Description generated',
        improve: 'Text improved',
        professional: 'Made professional',
        shorten: 'Text shortened',
        seo_summary: 'SEO summary created',
        write_bio: 'Bio generated',
        recruiter_language: 'Recruiter-ready',
        ats_optimize: 'ATS optimized',
        add_impact: 'Impact added',
        one_liner: 'One-liner created',
        interview_points: 'Talking points ready',
        value_proposition: 'Value prop generated',
        resume_bullets: 'Bullets generated',
      };

      toast({
        title: actionLabels[action],
        description: 'Content updated successfully',
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
