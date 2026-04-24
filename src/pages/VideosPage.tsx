import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { getEmbedUrl, isDirectVideoFile } from "@/lib/videoEmbed";

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  embed_url: string | null;
  category: string | null;
}

const VideoCard = ({ video }: { video: Video }) => {
  const [playing, setPlaying] = useState(false);
  const embedSrc = getEmbedUrl(video.embed_url);
  const canPlayInline = !!embedSrc;
  const isDirect = embedSrc ? isDirectVideoFile(embedSrc) : false;

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 overflow-hidden">
        {playing && embedSrc ? (
          isDirect ? (
            <video
              src={embedSrc}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={`${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => canPlayInline && setPlaying(true)}
            disabled={!canPlayInline}
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer disabled:cursor-default"
            aria-label={canPlayInline ? `Play ${video.title}` : video.title}
          >
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary/80" />
              </div>
            )}
            {canPlayInline && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-large">
                  <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            )}
            {video.category && (
              <span className="absolute top-3 left-3 bg-foreground/80 text-background px-2 py-0.5 rounded text-xs font-medium">
                {video.category}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
            {video.description}
          </p>
        )}

        {!canPlayInline && video.embed_url && video.embed_url.trim() && (
          <a
            href={video.embed_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            Watch Video
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};

const VideosPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Videos</h1>
            <p className="text-muted-foreground">Talks, tutorials, and demos.</p>
            {!loading && videos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing {videos.length} video{videos.length !== 1 ? 's' : ''}
              </p>
            )}
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
          ) : videos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No videos available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default VideosPage;
