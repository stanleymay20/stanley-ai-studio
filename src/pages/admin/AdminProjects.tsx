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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github, Sparkles, Eye, EyeOff, GripVertical, FolderOpen, FlaskConical } from 'lucide-react';
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
  notebook_url: '',
  demo_type: null,
};

const isValidNotebookUrl = (url: string): boolean => {
  if (!url) return true; // empty is valid (optional)
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const categoryOptions = ['AI', 'Data Science', 'Machine Learning', 'Research', 'Platform', 'Web App', 'Mobile'];

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
              <div className="grid gap-6 py-4">
                {/* Title first (needed for AI thumbnail) */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingProject.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>

                {/* Project Image with AI Generation */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project Thumbnail</Label>
                  <ThumbnailUploader
                    value={editingProject.image_url}
                    onChange={(url) => handleChange('image_url', url)}
                    title={editingProject.title || ''}
                    category={editingProject.category || 'AI'}
                    contentType="project"
                    folder="projects"
                  />
                </div>

                {/* Subtitle */}
                <div className="grid gap-2">
                  <Label htmlFor="subtitle" className="text-sm font-medium">Tagline</Label>
                  <Input
                    id="subtitle"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="A brief tagline for your project"
                  />
                </div>

                {/* Description with AI */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <AIWriterButtons
                      content={editingProject.description || editingProject.title || ''}
                      onResult={(text) => handleChange('description', text)}
                      context={{
                        type: 'project',
                        techStack: techStackInput,
                        category: editingProject.category || undefined,
                      }}
                    />
                  </div>
                  <Textarea
                    id="description"
                    value={editingProject.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe what this project does and why it matters..."
                    rows={4}
                  />
                </div>

                {/* Category & Tech Stack */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Input
                      id="category"
                      value={editingProject.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="AI, Data Science..."
                      list="category-options"
                    />
                    <datalist id="category-options">
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tech_stack" className="text-sm font-medium">Tech Stack</Label>
                    <Input
                      id="tech_stack"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="Python, React, TensorFlow"
                    />
                    <p className="text-xs text-muted-foreground">Separate with commas</p>
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="external_link" className="text-sm font-medium">Live Demo / Website</Label>
                    <Input
                      id="external_link"
                      value={editingProject.external_link || ''}
                      onChange={(e) => handleChange('external_link', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github_link" className="text-sm font-medium">GitHub</Label>
                    <Input
                      id="github_link"
                      value={editingProject.github_link || ''}
                      onChange={(e) => handleChange('github_link', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                
                {/* Recruiter Demo Section */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-semibold">Recruiter Demo</Label>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-2">
                    This link allows recruiters to run code in a read-only environment. No setup required.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 grid gap-2">
                      <Label htmlFor="notebook_url" className="text-sm font-medium">
                        Notebook URL
                      </Label>
                      <Input
                        id="notebook_url"
                        value={editingProject.notebook_url || ''}
                        onChange={(e) => handleChange('notebook_url', e.target.value)}
                        placeholder="https://colab.research.google.com/..."
                      />
                      {editingProject.notebook_url && !isValidNotebookUrl(editingProject.notebook_url) && (
                        <p className="text-xs text-destructive">Must be a valid HTTPS URL</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Google Colab, Deepnote, Observable, or JupyterLite
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="demo_type" className="text-sm font-medium">Demo Type</Label>
                      <Select
                        value={editingProject.demo_type || 'none'}
                        onValueChange={(v) => handleChange('demo_type', v === 'none' ? null : v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="notebook">Notebook</SelectItem>
                          <SelectItem value="live_demo">Live Demo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      <Sparkles className="h-4 w-4 inline mr-1 text-amber-500" />
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
                      <Eye className="h-4 w-4 inline mr-1 text-green-500" />
                      Published
                    </Label>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving || (!!editingProject.notebook_url && !isValidNotebookUrl(editingProject.notebook_url || ''))} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingProject.id ? 'Save Changes' : 'Create Project'}
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
                {/* Image Preview */}
                <div className="w-20 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
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
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{project.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs font-normal">
                      {project.category}
                    </Badge>
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                    {(project.tech_stack?.length || 0) > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{(project.tech_stack?.length || 0) - 3} more
                      </span>
                    )}
                    {project.notebook_url && (
                      <Badge variant="outline" className="text-xs font-normal gap-1">
                        <FlaskConical className="h-3 w-3" />
                        Notebook
                      </Badge>
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
