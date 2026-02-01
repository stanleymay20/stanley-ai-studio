import { Award, Languages } from "lucide-react";

const MembershipsSection = () => {
  const memberships = [
    "Member, German Data Science Society",
    "Certified in Machine Learning (Coursera)"
  ];

  const languages = [
    { language: "English", level: "fluent" },
    { language: "German", level: "intermediate" },
    { language: "Twi", level: "native" }
  ];

  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:shadow-medium transition-all duration-300">
      <div className="grid grid-cols-1 gap-6">
        {/* Memberships & Certifications */}
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
                <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-200">{membership}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
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
      </div>
    </div>
  );
};

export default MembershipsSection;