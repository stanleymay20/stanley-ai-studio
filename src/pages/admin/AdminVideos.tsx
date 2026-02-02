import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminData } from '@/hooks/useAdminData';
import { ThumbnailUploader } from '@/components/admin/ThumbnailUploader';
import { AIWriterButtons } from '@/components/admin/AIWriterButtons';
import { Loader2, Plus, Pencil, Trash2, Play, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Video = Tables<'videos'>;

const emptyVideo: Partial<Video> = {
  title: '',
  description: '',
  embed_url: '',
  thumbnail_url: '',
  category: 'Tutorial',
  published: false,
  sort_order: 0,
};

const categoryOptions = ['Tutorial', 'Talk', 'Demo', 'Interview', 'Presentation', 'Podcast', 'Other'];

// Video URL validation - accepts YouTube, Vimeo, Loom, Google Drive
const isValidVideoUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//,
    /^https?:\/\/(www\.)?vimeo\.com\//,
    /^https?:\/\/(www\.)?loom\.com\//,
    /^https?:\/\/drive\.google\.com\//,
    /^https?:\/\/(www\.)?dailymotion\.com\//,
    /^https?:\/\/(www\.)?wistia\.com\//,
  ];
  return patterns.some(pattern => pattern.test(url.trim()));
};

// Get embed URL for preview
const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;
  
  return null;
};

const AdminVideos = () => {
  const { data, loading, fetchData, createItem, updateItem, deleteItem } = useAdminData<Video>('videos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<Video> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDialog = () => {
    setEditingVideo({ ...emptyVideo });
    setDialogOpen(true);
  };

  const openEditDialog = (video: Video) => {
    setEditingVideo({ ...video });
    setDialogOpen(true);
  };

  const handleChange = (field: keyof Video, value: any) => {
    if (editingVideo) {
      setEditingVideo({ ...editingVideo, [field]: value });
    }
  };

  // URL validation state
  const urlValidation = useMemo(() => {
    const url = editingVideo?.embed_url || '';
    if (!url.trim()) return { valid: false, message: 'Video URL is required' };
    if (!isValidVideoUrl(url)) return { valid: false, message: 'Please enter a valid YouTube, Vimeo, Loom, or Google Drive URL' };
    return { valid: true, message: 'Valid video URL' };
  }, [editingVideo?.embed_url]);

  const embedPreviewUrl = useMemo(() => {
    return getEmbedUrl(editingVideo?.embed_url || '');
  }, [editingVideo?.embed_url]);

  const handleSave = async () => {
    if (!editingVideo) return;
    
    // Validate required fields
    if (!editingVideo.title?.trim()) {
      toast({ title: 'Title required', description: 'Please enter a video title', variant: 'destructive' });
      return;
    }
    
    if (!urlValidation.valid) {
      toast({ title: 'Invalid URL', description: urlValidation.message, variant: 'destructive' });
      return;
    }
    
    setSaving(true);
    if (editingVideo.id) {
      await updateItem(editingVideo.id, editingVideo);
    } else {
      await createItem(editingVideo);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteItem(id);
    }
  };

  const togglePublished = async (video: Video) => {
    await updateItem(video.id, { published: !video.published });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Videos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} video{data.length !== 1 ? 's' : ''} • {data.filter(v => v.published).length} published
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingVideo?.id ? 'Edit Video' : 'New Video'}
              </DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <div className="grid gap-6 py-4">
                {/* Title first (needed for AI thumbnail) */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingVideo.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Video title"
                  />
                </div>

                {/* Thumbnail with AI Generation */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thumbnail</Label>
                  <ThumbnailUploader
                    value={editingVideo.thumbnail_url}
                    onChange={(url) => handleChange('thumbnail_url', url)}
                    title={editingVideo.title || ''}
                    category={editingVideo.category || 'Tutorial'}
                    contentType="video"
                    folder="videos"
                  />
                </div>

                {/* Description with AI */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <AIWriterButtons
                      content={editingVideo.description || editingVideo.title || ''}
                      onResult={(text) => handleChange('description', text)}
                      context={{ type: 'video', category: editingVideo.category || undefined }}
                    />
                  </div>
                  <Textarea
                    id="description"
                    value={editingVideo.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of the video..."
                    rows={3}
                  />
                </div>

                {/* Video URL - REQUIRED */}
                <div className="grid gap-2">
                  <Label htmlFor="embed_url" className="text-sm font-medium">
                    Video URL * <span className="text-xs font-normal text-muted-foreground">(Required)</span>
                  </Label>
                  <Input
                    id="embed_url"
                    value={editingVideo.embed_url || ''}
                    onChange={(e) => handleChange('embed_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={editingVideo.embed_url && !urlValidation.valid ? 'border-destructive' : ''}
                  />
                  {/* Validation feedback */}
                  <div className="flex items-center gap-1.5">
                    {editingVideo.embed_url ? (
                      urlValidation.valid ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-green-600">{urlValidation.message}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          <span className="text-xs text-destructive">{urlValidation.message}</span>
                        </>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">Supports: YouTube, Vimeo, Loom, Google Drive</span>
                    )}
                  </div>
                  
                  {/* Embed Preview */}
                  {embedPreviewUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border bg-muted">
                      <div className="aspect-video">
                        <iframe
                          src={embedPreviewUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video Preview"
                        />
                      </div>
                      <div className="px-3 py-2 bg-muted/50 border-t border-border">
                        <p className="text-xs text-muted-foreground">Preview of embedded video</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Input
                    id="category"
                    value={editingVideo.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="Tutorial, Talk..."
                    list="video-category-options"
                  />
                  <datalist id="video-category-options">
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                {/* Toggle */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <Switch
                    id="published"
                    checked={editingVideo.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published" className="text-sm cursor-pointer">
                    <Eye className="h-4 w-4 inline mr-1 text-green-500" />
                    Published (visible on portfolio)
                  </Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingVideo.id ? 'Save Changes' : 'Add Video'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((video) => (
          <Card key={video.id} className="border-border/50 hover:shadow-soft transition-shadow overflow-hidden group">
            <div className="aspect-video bg-muted relative">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                  <Play className="h-12 w-12 text-purple-500/30" />
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-5 w-5 text-foreground ml-0.5" />
                </div>
              </div>
              {/* Status Badge */}
              <Badge 
                variant={video.published ? "default" : "secondary"}
                className={`absolute top-2 right-2 ${video.published 
                  ? "bg-green-500/90 text-white text-xs" 
                  : "bg-black/50 text-white text-xs"
                }`}
              >
                {video.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground truncate mb-1">{video.title}</h3>
              {video.category && (
                <Badge variant="outline" className="text-xs font-normal mb-2">
                  {video.category}
                </Badge>
              )}
              {video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
              )}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => togglePublished(video)}
                >
                  {video.published ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {video.embed_url && (
                  <a href={video.embed_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(video)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(video.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <Card className="border-dashed border-border col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No videos yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add videos, talks, or tutorials to showcase</p>
              <Button onClick={openCreateDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;
