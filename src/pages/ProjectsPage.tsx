import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  category: string | null;
}

const ProjectsPage = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">A collection of my work in data science, AI, and software development.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 ${project.featured ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent flex items-center justify-center">
                        {project.github_link ? (
                          <Github className="h-12 w-12 text-primary/60" />
                        ) : (
                          <ExternalLink className="h-12 w-12 text-primary/60" />
                        )}
                      </div>
                    )}
                    {project.featured && (
                      <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {project.category && (
                      <span className="absolute top-3 left-3 bg-foreground/80 text-background px-2 py-0.5 rounded text-xs font-medium">
                        {project.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2">{project.subtitle}</p>
                    )}
                    
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
                    
                    <div className="flex items-center gap-3">
                      {project.external_link && (
                        <a
                          href={project.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                        >
                          View Project
                          <ExternalLink className="h-3 w-3" />
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
