import { useEffect, useState } from "react";
import { Award, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface MembershipItem {
  organization: string;
  role?: string;
}

interface LanguageItem {
  language: string;
  level: string;
}

const MembershipsSection = () => {
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('memberships, languages')
          .limit(1)
          .single();

        if (error) throw error;
        
        // Parse memberships - DB may use 'title' as the main field
        if (Array.isArray(data?.memberships)) {
          const parsedMemberships = data.memberships
            .filter((item) => typeof item === 'object' && item !== null)
            .map((item) => {
              const obj = item as Record<string, unknown>;
              // Handle both 'organization' and 'title' (legacy format)
              const displayText = String(obj.organization || obj.title || '');
              return {
                organization: displayText,
                role: obj.role ? String(obj.role) : undefined,
              };
            });
          setMemberships(parsedMemberships);
        }
        
        // Parse languages
        if (Array.isArray(data?.languages)) {
          const parsedLanguages = data.languages
            .filter((item) => typeof item === 'object' && item !== null)
            .map((item) => {
              const obj = item as Record<string, unknown>;
              return {
                language: String(obj.language || ''),
                level: String(obj.level || ''),
              };
            });
          setLanguages(parsedLanguages);
        }
      } catch (error) {
        console.error('Error fetching memberships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Skeleton className="h-5 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-24 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if both are empty
  if (memberships.length === 0 && languages.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:shadow-medium transition-all duration-300">
      <div className="grid grid-cols-1 gap-6">
        {/* Memberships & Certifications */}
        {memberships.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Memberships & Certifications
            </h2>
            <div className="space-y-3">
              {memberships.map((membership, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-200">
                    {membership.role ? `${membership.role}, ${membership.organization}` : membership.organization}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full"></span>
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5 hover:bg-accent/20 transition-colors duration-200"
                >
                  <Languages className="h-3 w-3 text-accent" />
                  <span className="text-sm text-foreground">{lang.language}</span>
                  <span className="text-xs text-muted-foreground capitalize">({lang.level})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipsSection;
