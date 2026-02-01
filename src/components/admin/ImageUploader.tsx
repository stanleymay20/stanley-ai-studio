import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export const ImageUploader = ({ 
  value, 
  onChange, 
  folder = 'uploads',
  className,
  aspectRatio = 'video'
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };

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
      toast({ title: 'Image uploaded', description: 'Your image is ready to use' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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
    <div className={cn('relative', className)}>
      {value ? (
        <div className={cn('relative rounded-lg overflow-hidden border border-border bg-muted', aspectClasses[aspectRatio])}>
          <img 
            src={value} 
            alt="Uploaded" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
                disabled={uploading}
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
              variant="destructive"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            aspectClasses[aspectRatio],
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
            disabled={uploading}
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
      )}
    </div>
  );
};
