import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
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
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject?.id ? 'Edit Project' : 'New Project'}
              </DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingProject.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingProject.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingProject.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="AI, Data Science, Web..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={editingProject.sort_order || 0}
                      onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                  <Input
                    id="tech_stack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="Python, TensorFlow, React..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={editingProject.image_url || ''}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="external_link">External Link</Label>
                    <Input
                      id="external_link"
                      value={editingProject.external_link || ''}
                      onChange={(e) => handleChange('external_link', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github_link">GitHub Link</Label>
                    <Input
                      id="github_link"
                      value={editingProject.github_link || ''}
                      onChange={(e) => handleChange('github_link', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={editingProject.featured || false}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="published"
                      checked={editingProject.published !== false}
                      onCheckedChange={(checked) => handleChange('published', checked)}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="mt-4">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingProject.id ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {data.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  {project.featured && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Featured</span>
                  )}
                  {!project.published && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{project.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {project.external_link && (
                  <a href={project.external_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              No projects yet. Click "Add Project" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
