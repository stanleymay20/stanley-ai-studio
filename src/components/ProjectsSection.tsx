import { useEffect, useState } from "react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  tech_stack: string[] | null;
  external_link: string | null;
  github_link: string | null;
  image_url: string | null;
  featured: boolean | null;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .order('featured', { ascending: false })
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex gap-1 mb-3">
                  <Skeleton className="h-5 w-12 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 ${project.featured ? 'md:col-span-2' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Project Image */}
            <div className="h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-300">
                    {project.github_link ? (
                      <Github className="h-12 w-12 text-primary/80" />
                    ) : (
                      <ExternalLink className="h-12 w-12 text-primary/80" />
                    )}
                  </div>
                </>
              )}
              {project.featured && (
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors duration-200">
                {project.title}
              </h3>
              
              {project.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">{project.subtitle}</p>
              )}
              
              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{project.tech_stack.length - 4} more
                    </span>
                  )}
                </div>
              )}
              
              {project.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
              )}
              
              {/* Links */}
              <div className="flex items-center gap-3">
                {project.external_link && (
                  <a
                    href={project.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 group/link"
                  >
                    View Project
                    <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm font-medium hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
