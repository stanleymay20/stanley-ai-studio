import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Trash2, 
  Copy, 
  Loader2, 
  Image as ImageIcon, 
  Search,
  Grid,
  List,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
}

const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .list('uploads', { sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;

      const filesWithUrls: MediaFile[] = (data || [])
        .filter(f => !f.name.startsWith('.'))
        .map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-assets')
            .getPublicUrl(`uploads/${file.name}`);
          
          return {
            name: file.name,
            url: publicUrl,
            created_at: file.created_at || '',
            size: file.metadata?.size || 0,
          };
        });

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({ title: 'Error', description: 'Failed to load media files', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) continue;

      try {
        const ext = file.name.split('.').pop();
        const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

        const { error } = await supabase.storage
          .from('portfolio-assets')
          .upload(fileName, file, { upsert: true });

        if (!error) successCount++;
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (successCount > 0) {
      toast({ title: 'Upload complete', description: `${successCount} file(s) uploaded` });
      await fetchFiles();
    }
    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }, []);

  const deleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('portfolio-assets')
        .remove([`uploads/${fileName}`]);

      if (error) throw error;

      toast({ title: 'Deleted', description: 'File removed from library' });
      await fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete file', variant: 'destructive' });
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast({ title: 'Copied!', description: 'URL copied to clipboard' });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
        <p className="text-muted-foreground mt-1">Upload and manage images for your portfolio</p>
      </div>

      {/* Upload Zone */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <label
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all',
              dragActive 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Drop images here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG, WEBP • Max 5MB each</p>
              </div>
            )}
          </label>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Files */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No images match your search' : 'No images uploaded yet'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.name} className="group overflow-hidden">
              <div className="aspect-square relative bg-muted">
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyUrl(file.url)}
                  >
                    {copiedUrl === file.url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteFile(file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground truncate">{file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {filteredFiles.map((file) => (
              <div key={file.name} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(file.url)}
                  >
                    {copiedUrl === file.url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFile(file.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MediaLibrary;
