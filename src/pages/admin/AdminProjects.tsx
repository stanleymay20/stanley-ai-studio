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
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github, Sparkles, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

const emptyProject: Partial<Project> = {
  title: '',
  subtitle: '',
  description: '',
  category: 'AI',
  tech_stack: [],
  external_link: '',
  github_link: '',
  image_url: '',
  featured: false,
  published: true,
  sort_order: 0,
};

const AdminProjects = () => {
  const { data, loading, fetchData, createItem, updateItem, deleteItem } = useAdminData<Project>('projects');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [techStackInput, setTechStackInput] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDialog = () => {
    setEditingProject({ ...emptyProject });
    setTechStackInput('');
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject({ ...project });
    setTechStackInput(project.tech_stack?.join(', ') || '');
    setDialogOpen(true);
  };

  const handleChange = (field: keyof Project, value: any) => {
    if (editingProject) {
      setEditingProject({ ...editingProject, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingProject) return;
    
    setSaving(true);
    const projectData = {
      ...editingProject,
      tech_stack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingProject.id) {
      await updateItem(editingProject.id, projectData);
    } else {
      await createItem(projectData);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteItem(id);
    }
  };

  const togglePublished = async (project: Project) => {
    await updateItem(project.id, { published: !project.published });
  };

  const toggleFeatured = async (project: Project) => {
    await updateItem(project.id, { featured: !project.featured });
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
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} project{data.length !== 1 ? 's' : ''} • {data.filter(p => p.published).length} published
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingProject?.id ? 'Edit Project' : 'New Project'}
              </DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingProject.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="My Awesome Project"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="A brief tagline"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={editingProject.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Input
                      id="category"
                      value={editingProject.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="AI, Data Science..."
                      className="h-10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order" className="text-sm font-medium">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={editingProject.sort_order || 0}
                      onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tech_stack" className="text-sm font-medium">Tech Stack</Label>
                  <Input
                    id="tech_stack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="Python, React, TensorFlow (comma-separated)"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_url" className="text-sm font-medium">Image URL</Label>
                  <Input
                    id="image_url"
                    value={editingProject.image_url || ''}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://..."
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="external_link" className="text-sm font-medium">External Link</Label>
                    <Input
                      id="external_link"
                      value={editingProject.external_link || ''}
                      onChange={(e) => handleChange('external_link', e.target.value)}
                      placeholder="https://..."
                      className="h-10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github_link" className="text-sm font-medium">GitHub Link</Label>
                    <Input
                      id="github_link"
                      value={editingProject.github_link || ''}
                      onChange={(e) => handleChange('github_link', e.target.value)}
                      placeholder="https://github.com/..."
                      className="h-10"
                    />
                  </div>
                </div>
                
                {/* Toggles */}
                <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="featured"
                      checked={editingProject.featured || false}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
                    />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      Featured
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="published"
                      checked={editingProject.published !== false}
                      onCheckedChange={(checked) => handleChange('published', checked)}
                    />
                    <Label htmlFor="published" className="text-sm cursor-pointer">
                      <Eye className="h-4 w-4 inline mr-1" />
                      Published
                    </Label>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingProject.id ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {data.map((project) => (
          <Card key={project.id} className="border-border/50 hover:shadow-soft transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Drag Handle (visual only) */}
                <div className="pt-1 text-muted-foreground/30">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant={project.published ? "default" : "secondary"}
                      className={project.published 
                        ? "bg-green-500/10 text-green-600 border-green-500/20 text-xs" 
                        : "bg-muted text-muted-foreground text-xs"
                      }
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {project.subtitle && (
                    <p className="text-sm text-muted-foreground mb-2">{project.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs font-normal">
                      {project.category}
                    </Badge>
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                    {(project.tech_stack?.length || 0) > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{(project.tech_stack?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => togglePublished(project)}
                    title={project.published ? 'Unpublish' : 'Publish'}
                  >
                    {project.published ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  {project.external_link && (
                    <a href={project.external_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}>
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
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by adding your first project</p>
              <Button onClick={openCreateDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
