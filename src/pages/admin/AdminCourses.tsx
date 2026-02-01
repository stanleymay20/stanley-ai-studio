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
import { ThumbnailUploader } from '@/components/admin/ThumbnailUploader';
import { AIWriterButtons } from '@/components/admin/AIWriterButtons';
import { Loader2, Plus, Pencil, Trash2, ExternalLink, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

const emptyCourse: Partial<Course> = {
  title: '',
  description: '',
  thumbnail_url: '',
  external_link: '',
  category: 'Course',
  published: false,
  sort_order: 0,
};

const AdminCourses = () => {
  const { data, loading, fetchData, createItem, updateItem, deleteItem } = useAdminData<Course>('courses');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDialog = () => {
    setEditingCourse({ ...emptyCourse });
    setDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse({ ...course });
    setDialogOpen(true);
  };

  const handleChange = (field: keyof Course, value: any) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingCourse) return;
    
    setSaving(true);
    if (editingCourse.id) {
      await updateItem(editingCourse.id, editingCourse);
    } else {
      await createItem(editingCourse);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteItem(id);
    }
  };

  const togglePublished = async (course: Course) => {
    await updateItem(course.id, { published: !course.published });
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
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} course{data.length !== 1 ? 's' : ''} • {data.filter(c => c.published).length} published
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingCourse?.id ? 'Edit Course' : 'New Course'}
              </DialogTitle>
            </DialogHeader>
            {editingCourse && (
              <div className="grid gap-6 py-4">
                {/* Title first (needed for AI thumbnail) */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingCourse.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Course title"
                  />
                </div>

                {/* Thumbnail with AI generation */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thumbnail</Label>
                  <ThumbnailUploader
                    value={editingCourse.thumbnail_url}
                    onChange={(url) => handleChange('thumbnail_url', url)}
                    title={editingCourse.title || ''}
                    category={editingCourse.category || 'Course'}
                    contentType="course"
                    folder="courses"
                  />
                </div>

                {/* Description with AI */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <AIWriterButtons
                      content={editingCourse.description || editingCourse.title || ''}
                      onResult={(text) => handleChange('description', text)}
                      context={{ type: 'course' }}
                    />
                  </div>
                  <Textarea
                    id="description"
                    value={editingCourse.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="What does this course teach?"
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Input
                    id="category"
                    value={editingCourse.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., Data Science, AI, Business"
                  />
                </div>

                {/* External Link */}
                <div className="grid gap-2">
                  <Label htmlFor="external_link" className="text-sm font-medium">Course Link</Label>
                  <Input
                    id="external_link"
                    value={editingCourse.external_link || ''}
                    onChange={(e) => handleChange('external_link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                
                {/* Toggle */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <Switch
                    id="published"
                    checked={editingCourse.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published" className="text-sm cursor-pointer">
                    <Eye className="h-4 w-4 inline mr-1 text-green-500" />
                    Published (visible on portfolio)
                  </Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingCourse.id ? 'Save Changes' : 'Add Course'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((course) => (
          <Card key={course.id} className="border-border/50 hover:shadow-soft transition-shadow overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <GraduationCap className="h-12 w-12 text-primary/30" />
                </div>
              )}
              {/* Status Badge */}
              <Badge 
                variant={course.published ? "default" : "secondary"}
                className={`absolute top-2 right-2 ${course.published 
                  ? "bg-green-500/90 text-white text-xs" 
                  : "bg-black/50 text-white text-xs"
                }`}
              >
                {course.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground truncate mb-1">{course.title}</h3>
              {course.category && (
                <Badge variant="outline" className="text-xs font-normal mb-2">
                  {course.category}
                </Badge>
              )}
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
              )}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => togglePublished(course)}
                >
                  {course.published ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {course.external_link && (
                  <a href={course.external_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(course)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(course.id)}>
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
                <GraduationCap className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No courses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add courses you've created or taught</p>
              <Button onClick={openCreateDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
