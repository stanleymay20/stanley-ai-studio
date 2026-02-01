import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, Wand2, FileText, Minimize2, Search, Loader2, Target, Briefcase, TrendingUp, MessageSquare, Zap } from 'lucide-react';
import { useAIWriter } from '@/hooks/useAIWriter';

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

interface AIWriterButtonsProps {
  content: string;
  onResult: (text: string) => void;
  context?: {
    type?: string;
    techStack?: string;
    category?: string;
  };
  variant?: 'inline' | 'dropdown' | 'recruiter';
}

export const AIWriterButtons = ({ content, onResult, context, variant = 'dropdown' }: AIWriterButtonsProps) => {
  const { generateText, loading } = useAIWriter();

  const handleAction = async (action: AIAction) => {
    const result = await generateText(action, content, context);
    if (result) {
      onResult(result);
    }
  };

  // Recruiter-focused variant for summary/value prop
  if (variant === 'recruiter') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Briefcase className="h-4 w-4 text-primary" />
            )}
            Recruiter AI
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleAction('value_proposition')}>
            <Target className="h-4 w-4 mr-2 text-blue-500" />
            Write for recruiters
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('ats_optimize')}>
            <Search className="h-4 w-4 mr-2 text-green-500" />
            Optimize for ATS
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('improve')}>
            <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
            Improve clarity
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('shorten')}>
            <Minimize2 className="h-4 w-4 mr-2 text-orange-500" />
            Shorten for scanning
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleAction('write_description')}
          disabled={loading}
          className="text-xs"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
          Write for me
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleAction('improve')}
          disabled={loading}
          className="text-xs"
        >
          <Wand2 className="h-3 w-3 mr-1" />
          Improve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleAction('shorten')}
          disabled={loading}
          className="text-xs"
        >
          <Minimize2 className="h-3 w-3 mr-1" />
          Shorten
        </Button>
      </div>
    );
  }

  // Default dropdown with all options including recruiter-focused
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          AI Assist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* Writing Actions */}
        <DropdownMenuItem onClick={() => handleAction('write_description')}>
          <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
          Write description for me
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('improve')}>
          <Wand2 className="h-4 w-4 mr-2 text-blue-500" />
          Improve this text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('professional')}>
          <FileText className="h-4 w-4 mr-2 text-green-500" />
          Make it more professional
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('shorten')}>
          <Minimize2 className="h-4 w-4 mr-2 text-orange-500" />
          Shorten for portfolio
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('seo_summary')}>
          <Search className="h-4 w-4 mr-2 text-cyan-500" />
          Generate SEO summary
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Recruiter-Focused Actions */}
        <DropdownMenuItem onClick={() => handleAction('recruiter_language')}>
          <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
          Rewrite in recruiter language
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('add_impact')}>
          <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
          Add measurable impact
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('one_liner')}>
          <Zap className="h-4 w-4 mr-2 text-amber-500" />
          Generate 1-line summary
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('interview_points')}>
          <MessageSquare className="h-4 w-4 mr-2 text-rose-500" />
          Generate interview talking points
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
