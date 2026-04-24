import { useEffect, useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmbedUrl, isDirectVideoFile } from "@/lib/videoEmbed";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  embed_url: string | null;
  category: string | null;
}

const VideosSection = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
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

  if (loading) {
    return (
      <div className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => {
          const embedSrc = getEmbedUrl(video.embed_url);
          const [playing, setPlaying] = [
            // local state via closure key trick — replaced by component below
            false,
            (_: boolean) => {},
          ];
          return (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              embedSrc={embedSrc}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VideosSection;
