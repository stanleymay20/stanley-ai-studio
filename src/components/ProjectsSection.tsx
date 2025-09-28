import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectsSection = () => {
  const projects = [
    {
      title: "ScrollIntel™",
      subtitle: "Enterprise AI Platform",
      description: "Full-stack AI system replacing CTO & data science functions with autonomous agents, BI dashboards, and AI-generated visual content.",
      tech: ["Python", "FastAPI", "React", "GCP", "AI Agents"],
      buttonText: "View Demo",
      buttonIcon: ExternalLink,
      featured: true
    },
    {
      title: "AI Resume Screener",
      subtitle: "NLP Project",
      description: "Natural language processing system to automatically screen job applicants with 87% accuracy.",
      tech: ["Python", "spaCy", "scikit-learn", "Streamlit"],
      buttonText: "GitHub Repo",
      buttonIcon: Github,
      featured: false
    },
    {
      title: "ScrollUniversity",
      subtitle: "AI-Powered Learning Platform",
      description: "A scroll-governed education system with 26 AI specs, supporting autonomous learning and authorship validation.",
      tech: ["AI Agents", "Next.js", "Tailwind", "Google Cloud"],
      buttonText: "View Project",
      buttonIcon: ExternalLink,
      featured: false
    }
  ];

  return (
    <section className="section-spacing bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const Icon = project.buttonIcon;
            return (
              <div
                key={index}
                className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-large transition-all duration-300 hover:-translate-y-1 ${project.featured ? 'md:col-span-2 lg:col-span-3' : ''}`}
              >
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary/30 rounded-lg mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/80 font-medium">{project.title}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                    {project.featured && (
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-medium mb-3">{project.subtitle}</p>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Icon className="h-4 w-4 mr-2" />
                    {project.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;