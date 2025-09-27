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
    <section className="section-spacing bg-background">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Memberships & Certifications */}
          <div>
            <h2 className="text-display text-foreground mb-8">Memberships & Certifications</h2>
            <div className="profile-card p-8">
              <div className="space-y-4">
                {memberships.map((membership, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-foreground">{membership}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-display text-foreground mb-8">Languages</h2>
            <div className="profile-card p-8">
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg mt-1">
                      <Languages className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{lang.language}</p>
                      <p className="text-muted-foreground text-sm capitalize">({lang.level})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipsSection;