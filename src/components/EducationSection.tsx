import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
    <section className="section-spacing bg-muted/30">
      <div className="container-narrow">
        <h2 className="text-display text-foreground mb-8">Education</h2>
        <div className="profile-card p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading text-foreground mb-2">
                BSc Data Science, AI & Digital Business
              </h3>
              <p className="text-primary font-medium mb-2">
                GISMA University of Applied Sciences, Germany
              </p>
              <p className="text-muted-foreground mb-4">2021–2025</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Thesis:</strong> Predicting Technological Shifts in Germany's Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;