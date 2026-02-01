import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, Plus, Pencil, Trash2, Play, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

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

const categoryOptions = ['Tutorial', 'Talk', 'Demo', 'Interview', 'Presentation', 'Other'];

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

  const handleSave = async () => {
    if (!editingVideo) return;
    
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingVideo?.id ? 'Edit Video' : 'New Video'}
              </DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingVideo.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Video title"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={editingVideo.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="embed_url" className="text-sm font-medium">Video URL</Label>
                  <Input
                    id="embed_url"
                    value={editingVideo.embed_url || ''}
                    onChange={(e) => handleChange('embed_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">YouTube, Vimeo, or direct video URL</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail_url" className="text-sm font-medium">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={editingVideo.thumbnail_url || ''}
                    onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                    placeholder="https://..."
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Input
                      id="category"
                      value={editingVideo.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="Tutorial, Talk..."
                      className="h-10"
                      list="category-options"
                    />
                    <datalist id="category-options">
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order" className="text-sm font-medium">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={editingVideo.sort_order || 0}
                      onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                      className="h-10"
                    />
                  </div>
                </div>
                
                {/* Toggle */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <Switch
                    id="published"
                    checked={editingVideo.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published" className="text-sm cursor-pointer">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Published (visible on portfolio)
                  </Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingVideo.id ? 'Update Video' : 'Create Video'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos List */}
      <div className="space-y-3">
        {data.map((video) => (
          <Card key={video.id} className="border-border/50 hover:shadow-soft transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="pt-1 text-muted-foreground/30">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Thumbnail */}
                <div className="w-20 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="h-5 w-5 text-purple-500/60" />
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 flex items-center justify-center transition-colors">
                    <Play className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
                    <Badge 
                      variant={video.published ? "default" : "secondary"}
                      className={video.published 
                        ? "bg-green-500/10 text-green-600 border-green-500/20 text-xs" 
                        : "bg-muted text-muted-foreground text-xs"
                      }
                    >
                      {video.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{video.description}</p>
                  )}
                  {video.category && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {video.category}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => togglePublished(video)}
                    title={video.published ? 'Unpublish' : 'Publish'}
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
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <Card className="border-dashed border-border">
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
