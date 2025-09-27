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
    <section className="section-spacing bg-muted/30">
      <div className="container-narrow">
        <h2 className="text-display text-foreground mb-8">Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.buttonIcon;
            return (
              <div
                key={index}
                className={`project-card ${project.featured ? 'lg:col-span-2' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-heading text-foreground">{project.title}</h3>
                      {project.featured && (
                        <span className="professional-badge text-accent border-accent/30 bg-accent/10">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium mb-3">{project.subtitle}</p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="professional-badge text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Button className="btn-primary w-fit">
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