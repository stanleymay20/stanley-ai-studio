import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Wand2, FileText, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAIHelpProps {
  className?: string;
}

export const FloatingAIHelp = ({ className }: FloatingAIHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    { icon: Wand2, title: 'Write for me', desc: 'Click the AI button next to any text field' },
    { icon: FileText, title: 'Improve text', desc: 'Select existing text and use "Improve" option' },
    { icon: Zap, title: 'Generate images', desc: 'Click "Generate with AI" under image uploads' },
    { icon: Target, title: 'SEO summaries', desc: 'Use the SEO button for search-friendly descriptions' },
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Help Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 p-4 bg-card border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Assistant Tips
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <tip.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              AI is here to help you create better content faster
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
          "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
          isOpen && "rotate-45"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
