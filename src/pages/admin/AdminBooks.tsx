import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Book = Tables<'books'>;

const emptyBook: Partial<Book> = {
  title: '',
  description: '',
  cover_url: '',
  external_link: '',
  status: 'draft',
  published: false,
  sort_order: 0,
};

const AdminBooks = () => {
  const { data, loading, fetchData, createItem, updateItem, deleteItem } = useAdminData<Book>('books');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDialog = () => {
    setEditingBook({ ...emptyBook });
    setDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook({ ...book });
    setDialogOpen(true);
  };

  const handleChange = (field: keyof Book, value: any) => {
    if (editingBook) {
      setEditingBook({ ...editingBook, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingBook) return;
    
    setSaving(true);
    if (editingBook.id) {
      await updateItem(editingBook.id, editingBook);
    } else {
      await createItem(editingBook);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
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
          <h1 className="text-3xl font-bold text-foreground">Books</h1>
          <p className="text-muted-foreground mt-1">Manage your book collection</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBook?.id ? 'Edit Book' : 'New Book'}
              </DialogTitle>
            </DialogHeader>
            {editingBook && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingBook.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingBook.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cover_url">Cover Image URL</Label>
                  <Input
                    id="cover_url"
                    value={editingBook.cover_url || ''}
                    onChange={(e) => handleChange('cover_url', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="external_link">External Link</Label>
                  <Input
                    id="external_link"
                    value={editingBook.external_link || ''}
                    onChange={(e) => handleChange('external_link', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      value={editingBook.status || ''}
                      onChange={(e) => handleChange('status', e.target.value)}
                      placeholder="draft, reading, completed..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={editingBook.sort_order || 0}
                      onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={editingBook.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="mt-4">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingBook.id ? 'Update Book' : 'Create Book'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {data.map((book) => (
          <Card key={book.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4 flex-1">
                {book.cover_url && (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{book.title}</h3>
                    {!book.published && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.description}</p>
                  <span className="text-xs text-muted-foreground">{book.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {book.external_link && (
                  <a href={book.external_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(book)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              No books yet. Click "Add Book" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;
