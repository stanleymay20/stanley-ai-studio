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
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="grid grid-cols-1 gap-6">
        {/* Memberships & Certifications */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">Memberships & Certifications</h2>
          <div className="space-y-3">
            {memberships.map((membership, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1 bg-primary/10 rounded-lg mt-0.5">
                  <Award className="h-3 w-3 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">{membership}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">Languages</h2>
          <div className="space-y-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1 bg-accent/10 rounded-lg mt-0.5">
                  <Languages className="h-3 w-3 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">{lang.language} <span className="capitalize">({lang.level})</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipsSection;