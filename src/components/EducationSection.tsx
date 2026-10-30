import { GraduationCap } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { jsonRecords } from "@/data/publicProfile";
const EducationSection = () => {
  const profile = usePublicProfile();
  const education = jsonRecords(profile.education).map(obj => ({
    degree: String(obj.degree || ""), institution: String(obj.institution || ""),
    year: String(obj.year || obj.period || ""),
    description: obj.thesis ? `Thesis: ${String(obj.thesis)}` : obj.description ? String(obj.description) : undefined,
  }));
  if (!education.length) return null;
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
