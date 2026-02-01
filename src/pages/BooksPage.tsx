import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BookItem {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  external_link: string | null;
  status: string | null;
}

const BooksPage = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Books & Publications</h1>
            <p className="text-muted-foreground">Books I've written, co-authored, or contributed to.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No books available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    {book.cover_url ? (
                      <img 
                        src={book.cover_url} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Book className="h-16 w-16 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {book.status && (
                      <span className="absolute top-2 right-2 bg-accent/90 text-accent-foreground px-2 py-0.5 rounded text-xs font-medium">
                        {book.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Book
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

export default BooksPage;
