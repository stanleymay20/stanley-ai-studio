import { useEffect, useState } from "react";
import { Book, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface BookItem {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  external_link: string | null;
  status: string | null;
}

const BooksSection = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide">Books & Publications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <Skeleton className="h-32 w-full mb-4 rounded-lg" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Books & Publications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Book Cover */}
            <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
              {book.cover_url ? (
                <img 
                  src={book.cover_url} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Book className="h-12 w-12 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
              )}
              {book.status && (
                <span className="absolute top-2 right-2 bg-accent/90 text-accent-foreground px-2 py-0.5 rounded text-xs font-medium">
                  {book.status}
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {book.title}
              </h3>
              
              {book.description && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
                  {book.description}
                </p>
              )}
              
              {book.external_link && (
                <a
                  href={book.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 group/link"
                >
                  View Book
                  <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksSection;
