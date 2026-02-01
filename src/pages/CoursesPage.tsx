import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  external_link: string | null;
  category: string | null;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
            <p className="text-muted-foreground">Educational content and courses I've created or contributed to.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <GraduationCap className="h-12 w-12 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {course.category && (
                      <span className="absolute top-3 right-3 bg-accent/90 text-accent-foreground px-2 py-0.5 rounded text-xs font-medium">
                        {course.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    {course.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {course.description}
                      </p>
                    )}
                    
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

export default CoursesPage;
