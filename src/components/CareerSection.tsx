import { Briefcase } from "lucide-react";

const CareerSection = () => {
  const experiences = [
    {
      title: "Co-founder",
      company: "ScrollIntel",
      description: "Enterprise AI Platform",
      period: "2024–present",
      current: true
    },
    {
      title: "Student Assistant",
      company: "GISMA Business School",
      description: "",
      period: "2022–2024",
      current: false
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Professional Career
      </h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="profile-card p-4 group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
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