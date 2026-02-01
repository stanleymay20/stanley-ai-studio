import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, Play, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  tech_stack: string[] | null;
  external_link: string | null;
  github_link: string | null;
  image_url: string | null;
}

interface FeaturedVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  embed_url: string | null;
  category: string | null;
}

interface FeaturedCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  external_link: string | null;
  category: string | null;
}

const FeaturedWork = () => {
  const [project, setProject] = useState<FeaturedProject | null>(null);
  const [video, setVideo] = useState<FeaturedVideo | null>(null);
  const [course, setCourse] = useState<FeaturedCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch featured project
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        // Fetch first published video
        const { data: videoData } = await supabase
          .from('videos')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        // Fetch first published course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        setProject(projectData);
        setVideo(videoData);
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          Featured Work
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!project && !video && !course) {
    return null;
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          Featured Work
        </h2>
        <span className="text-sm text-muted-foreground">Start here</span>
      </div>
      
      {/* Impact Signal */}
      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full"></span>
        Impact: Deployed ML systems · Automated workflows · Data-driven decision tools
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Featured Project */}
        {project && (
          <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent flex items-center justify-center">
                  <Github className="h-16 w-16 text-primary/60" />
                </div>
              )}
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                Featured Project
              </span>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              
              {project.subtitle && (
                <p className="text-sm text-muted-foreground mb-3">{project.subtitle}</p>
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
                </div>
              )}
              
              {project.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
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
                <Link
                  to="/projects"
                  className="text-muted-foreground text-sm font-medium hover:text-foreground inline-flex items-center gap-1"
                >
                  All Projects
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Featured Video or Course */}
        {(video || course) && (
          <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            {video ? (
              <>
                <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Play className="h-16 w-16 text-primary/60" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/10 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-large">
                      <Play className="h-6 w-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-foreground/80 text-background px-3 py-1 rounded-full text-xs font-medium">
                    Featured Video
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {video.embed_url && (
                      <a
                        href={video.embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Watch Now
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Link
                      to="/videos"
                      className="text-muted-foreground text-sm font-medium hover:text-foreground inline-flex items-center gap-1"
                    >
                      All Videos
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </>
            ) : course && (
              <>
                <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-16 w-16 text-primary/60 flex items-center justify-center text-4xl">🎓</div>
                  )}
                  <span className="absolute top-3 left-3 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Featured Course
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  {course.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {course.external_link && (
                      <a
                        href={course.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Course
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Link
                      to="/courses"
                      className="text-muted-foreground text-sm font-medium hover:text-foreground inline-flex items-center gap-1"
                    >
                      All Courses
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedWork;
