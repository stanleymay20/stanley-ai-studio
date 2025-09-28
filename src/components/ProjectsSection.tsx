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
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const Icon = project.buttonIcon;
            return (
              <div
                key={index}
                className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 ${project.featured ? 'md:col-span-2' : ''}`}
              >
                {/* Project Image */}
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <Icon className="h-12 w-12 text-primary/80" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{project.title}</h3>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Read More Link */}
                  <a
                    href="#"
                    className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ProjectsSection;