import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminData } from '@/hooks/useAdminData';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { AIWriterButtons } from '@/components/admin/AIWriterButtons';
import { Loader2, Plus, Pencil, Trash2, ExternalLink, BookOpen, Eye, EyeOff } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Book = Tables<'books'>;

const emptyBook: Partial<Book> = {
  title: '',
  description: '',
  cover_url: '',
  external_link: '',
  status: 'reading',
  published: false,
  sort_order: 0,
};

const statusOptions = [
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'to-read', label: 'To Read' },
  { value: 'recommended', label: 'Recommended' },
];

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

  const togglePublished = async (book: Book) => {
    await updateItem(book.id, { published: !book.published });
  };

  const getStatusBadge = (status: string | null) => {
    const option = statusOptions.find(s => s.value === status);
    return option?.label || status || 'Unknown';
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
          <h1 className="text-2xl font-bold text-foreground">Books</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} book{data.length !== 1 ? 's' : ''} • {data.filter(b => b.published).length} published
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingBook?.id ? 'Edit Book' : 'New Book'}
              </DialogTitle>
            </DialogHeader>
            {editingBook && (
              <div className="grid gap-6 py-4">
                {/* Book Cover */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Book Cover</Label>
                  <ImageUploader
                    value={editingBook.cover_url}
                    onChange={(url) => handleChange('cover_url', url)}
                    folder="books"
                    aspectRatio="portrait"
                  />
                </div>

                {/* Title */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={editingBook.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Book title"
                  />
                </div>

                {/* Description with AI */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium">Description / Notes</Label>
                    <AIWriterButtons
                      content={editingBook.description || editingBook.title || ''}
                      onResult={(text) => handleChange('description', text)}
                      context={{ type: 'book' }}
                    />
                  </div>
                  <Textarea
                    id="description"
                    value={editingBook.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Your notes or a brief description..."
                    rows={3}
                  />
                </div>

                {/* External Link */}
                <div className="grid gap-2">
                  <Label htmlFor="external_link" className="text-sm font-medium">Link (Amazon, Goodreads, etc.)</Label>
                  <Input
                    id="external_link"
                    value={editingBook.external_link || ''}
                    onChange={(e) => handleChange('external_link', e.target.value)}
                    placeholder="https://amazon.com/..."
                  />
                </div>

                {/* Status */}
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-sm font-medium">Reading Status</Label>
                  <Select
                    value={editingBook.status || 'reading'}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Toggle */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <Switch
                    id="published"
                    checked={editingBook.published || false}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                  <Label htmlFor="published" className="text-sm cursor-pointer">
                    <Eye className="h-4 w-4 inline mr-1 text-green-500" />
                    Published (visible on portfolio)
                  </Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingBook.id ? 'Save Changes' : 'Add Book'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Books List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((book) => (
          <Card key={book.id} className="border-border/50 hover:shadow-soft transition-shadow overflow-hidden">
            <div className="aspect-[3/4] bg-muted relative">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <BookOpen className="h-12 w-12 text-primary/30" />
                </div>
              )}
              {/* Status Badge */}
              <Badge 
                variant={book.published ? "default" : "secondary"}
                className={`absolute top-2 right-2 ${book.published 
                  ? "bg-green-500/90 text-white text-xs" 
                  : "bg-black/50 text-white text-xs"
                }`}
              >
                {book.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground truncate mb-1">{book.title}</h3>
              <Badge variant="outline" className="text-xs font-normal mb-2">
                {getStatusBadge(book.status)}
              </Badge>
              {book.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
              )}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => togglePublished(book)}
                >
                  {book.published ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {book.external_link && (
                  <a href={book.external_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(book)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(book.id)}>
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
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No books yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add books you've read or recommend</p>
              <Button onClick={openCreateDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;
