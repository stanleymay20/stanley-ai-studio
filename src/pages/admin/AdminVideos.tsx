import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, Plus, Pencil, Trash2, Play } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Video = Tables<'videos'>;

const emptyVideo: Partial<Video> = {
  title: '',
  description: '',
  embed_url: '',
  thumbnail_url: '',
  category: '',
  published: false,
  sort_order: 0,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Videos</h1>
          <p className="text-muted-foreground mt-1">Manage your video content</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVideo?.id ? 'Edit Video' : 'New Video'}
              </DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingVideo.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingVideo.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="embed_url">Embed URL (YouTube/Vimeo)</Label>
                  <Input
                    id="embed_url"
                    value={editingVideo.embed_url || ''}
                    onChange={(e) => handleChange('embed_url', e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={editingVideo.thumbnail_url || ''}
                    onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingVideo.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="Tutorial, Talk, Demo..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={editingVideo.sort_order || 0}
                      onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={editingVideo.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="mt-4">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingVideo.id ? 'Update Video' : 'Create Video'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {data.map((video) => (
          <Card key={video.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Play className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{video.title}</h3>
                    {!video.published && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{video.description}</p>
                  {video.category && (
                    <span className="text-xs text-muted-foreground">{video.category}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              No videos yet. Click "Add Video" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;
