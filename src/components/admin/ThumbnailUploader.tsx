import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThumbnailUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  title?: string;
  category?: string;
  contentType: 'project' | 'book' | 'video' | 'course';
  folder?: string;
  className?: string;
}

const styleOptions = [
  { value: 'clean', label: 'Clean' },
  { value: 'professional', label: 'Professional' },
  { value: 'tech', label: 'Tech / AI' },
  { value: 'minimal', label: 'Minimal' },
];

const aspectRatioByType = {
  project: 'aspect-video', // 16:9
  video: 'aspect-video', // 16:9
  course: 'aspect-video', // 16:9
  book: 'aspect-[3/4]', // Portrait
};

export const ThumbnailUploader = ({ 
  value, 
  onChange, 
  title = '',
  category = '',
  contentType,
  folder = 'thumbnails',
  className,
}: ThumbnailUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const { adminSecret } = useAdmin();

  const aspectClass = aspectRatioByType[contentType];

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file (JPG, PNG, WEBP)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast({ title: 'Image uploaded', description: 'Your thumbnail is ready' });
    } catch (error) {
      console.error('Upload error');
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const generateWithAI = async () => {
    if (!title?.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title first to generate a thumbnail',
        variant: 'destructive',
      });
      return;
    }

    if (!adminSecret) {
      toast({
        title: 'Not authenticated',
        description: 'Please log in to admin panel first',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image', {
        body: {
          title,
          category,
          style: selectedStyle,
          type: contentType,
          secret: adminSecret,
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      onChange(data.url);
      toast({ title: 'Thumbnail generated', description: 'AI thumbnail is ready to use' });
      setShowStyleSelector(false);
    } catch (error) {
      console.error('AI generation error');
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Could not generate thumbnail',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onChange(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {value ? (
        <div className={cn('relative rounded-lg overflow-hidden border border-border bg-muted', aspectClass)}>
          <img 
            src={value} 
            alt="Thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
                disabled={uploading || generating}
              />
              <Button type="button" size="sm" variant="secondary" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </span>
              </Button>
            </label>
            <Button 
              type="button" 
              size="sm" 
              variant="secondary"
              onClick={() => setShowStyleSelector(true)}
              disabled={generating}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="destructive"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Drop Zone for Manual Upload */}
          <label
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
              aspectClass,
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground hover:bg-muted/50'
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
              onChange={handleFileInput}
              disabled={uploading || generating}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                <ImageIcon className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drop image here</p>
                  <p className="text-xs">or click to browse</p>
                </div>
                <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP up to 5MB</p>
              </div>
            )}
          </label>

          {/* AI Generation Section */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={generateWithAI}
                disabled={generating || !title?.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            {!title?.trim() && (
              <p className="text-xs text-muted-foreground">Enter a title above to enable AI generation</p>
            )}
          </div>
        </div>
      )}

      {/* Regenerate Modal (when image exists) */}
      {showStyleSelector && value && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-3">
          <div className="flex gap-2">
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="flex-1 gap-2"
              onClick={generateWithAI}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate New
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowStyleSelector(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
