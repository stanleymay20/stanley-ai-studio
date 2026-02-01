import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Education
      </h2>
      <div className="profile-card p-6 group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              BSc Data Science, AI & Digital Business
            </h3>
            <p className="text-primary font-medium text-sm mb-1">
              GISMA University of Applied Sciences
            </p>
            <p className="text-muted-foreground text-sm mb-3">2021–2025</p>
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Thesis:</strong> Predicting Technological Shifts in Germany's Manufacturing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;