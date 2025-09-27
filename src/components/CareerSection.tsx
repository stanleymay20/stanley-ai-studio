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
    <section className="section-spacing bg-background">
      <div className="container-narrow">
        <h2 className="text-display text-foreground mb-8">Professional Career</h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="profile-card p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-heading text-foreground">
                      {exp.title} • {exp.company}
                    </h3>
                    {exp.current && (
                      <span className="professional-badge text-accent border-accent/30 bg-accent/10">
                        Current
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-primary font-medium mb-2">{exp.description}</p>
                  )}
                  <p className="text-muted-foreground">{exp.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;