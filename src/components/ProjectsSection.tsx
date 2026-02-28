import { useEffect, useState } from "react";
import { ExternalLink, Github, Play } from "lucide-react";
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
  notebook_url: string | null;
  demo_type: string | null;
}

const normalizeUrl = (url: string | null): string | null => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

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
          <span className="w-1 h-5 bg-primary rounded-full"></span>
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
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
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
              <div className="flex items-center gap-3 flex-wrap">
                {project.external_link && (
                  <a
                    href={normalizeUrl(project.external_link)!}
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
                    href={normalizeUrl(project.github_link)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm font-medium hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                )}
                {project.notebook_url && (
                  <a
                    href={normalizeUrl(project.notebook_url)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    {project.demo_type === 'live_demo' ? 'Live Demo' : 'Run Notebook'}
                  </a>
                )}
              </div>
              {project.notebook_url && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  Designed for recruiter review — safe, read-only, no installation.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
