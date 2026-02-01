import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

const EducationSection = () => {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('education')
          .limit(1)
          .single();

        if (error) throw error;
        
        const eduData = data?.education;
        if (Array.isArray(eduData)) {
          // Cast through unknown to safely access properties
          // DB schema may use 'period' instead of 'year'
          const parsed = eduData
            .filter((item) => typeof item === 'object' && item !== null)
            .map((item) => {
              const obj = item as Record<string, unknown>;
              return {
                degree: String(obj.degree || ''),
                institution: String(obj.institution || ''),
                year: String(obj.year || obj.period || ''),
                description: obj.thesis 
                  ? `Thesis: ${String(obj.thesis)}` 
                  : obj.description ? String(obj.description) : undefined,
              };
            });
          setEducation(parsed);
        }
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="profile-card p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (education.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Education
      </h3>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="profile-card p-4 md:p-6 group">
            <div className="flex items-start gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {edu.degree}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {edu.institution}
                </p>
                <p className="text-muted-foreground text-sm mb-2">{edu.year}</p>
                {edu.description && (
                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      {edu.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
