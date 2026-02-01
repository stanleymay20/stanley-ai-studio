import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CareerItem {
  title: string;
  company: string;
  period: string;
  description?: string;
  current?: boolean;
}

const CareerSection = () => {
  const [career, setCareer] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('career')
          .limit(1)
          .single();

        if (error) throw error;
        
        const careerData = data?.career;
        if (Array.isArray(careerData)) {
          // Cast through unknown to safely access properties
          const parsed = careerData
            .filter((item) => typeof item === 'object' && item !== null)
            .map((item, idx) => {
              const obj = item as Record<string, unknown>;
              const period = String(obj.period || '');
              return {
                title: String(obj.title || ''),
                company: String(obj.company || ''),
                period,
                description: obj.description ? String(obj.description) : undefined,
                current: idx === 0 && period.toLowerCase().includes('present')
              };
            });
          setCareer(parsed);
        }
      } catch (error) {
        console.error('Error fetching career:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="profile-card p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (career.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Professional Career
      </h3>
      <div className="space-y-4">
        {career.map((exp, index) => (
          <div key={index} className="profile-card p-4 group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {exp.title} • {exp.company}
                  </h3>
                  {exp.current && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30 w-fit">
                      Current
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-primary font-medium text-xs mb-1">{exp.description}</p>
                )}
                <p className="text-muted-foreground text-xs">{exp.period}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerSection;
