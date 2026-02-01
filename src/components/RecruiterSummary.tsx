import { Mail, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecruiterSummary = () => {
  const coreSkills = [
    "Python",
    "Machine Learning", 
    "NLP",
    "SQL",
    "Data Pipelines",
    "Cloud (AWS/GCP)",
    "APIs",
    "TensorFlow"
  ];

  return (
    <div className="bg-gradient-to-r from-card via-card to-primary/5 rounded-xl p-6 border border-border shadow-soft">
      {/* Role & Value Proposition */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI Engineer & Data Scientist
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          I build <span className="text-foreground font-medium">production-ready AI systems</span>, 
          data pipelines, and automation tools that deliver measurable business impact.
        </p>
      </div>

      {/* Tech Stack Chips - Scannable Keywords */}
      <div className="flex flex-wrap gap-2 mb-5">
        {coreSkills.map((skill) => (
          <span
            key={skill}
            className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Recruiter CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-sm text-muted-foreground">Interested in working together?</span>
        <div className="flex items-center gap-2">
          <a href="mailto:stanleymay20@gmail.com">
            <Button size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Get in Touch
            </Button>
          </a>
          <a 
            href="https://linkedin.com/in/stanleyoseiwusu" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSummary;
