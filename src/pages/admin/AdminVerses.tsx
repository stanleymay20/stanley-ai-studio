import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { AIWriterButtons } from '@/components/admin/AIWriterButtons';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, Save, Plus, Pencil, Trash2, Book, Eye, EyeOff, 
  Sparkles, Check, Settings2, RefreshCw
} from 'lucide-react';

interface Verse {
  id: string;
  verse_text: string;
  reference: string;
  theme: string | null;
  reflection: string | null;
  is_active: boolean;
  display_date: string | null;
  mode: string | null;
  created_at: string;
}

interface VerseSettings {
  id: string;
  enabled: boolean;
  mode: string;
  show_reflection: boolean;
  placement: string;
}

const themeOptions = ['wisdom', 'faith', 'leadership', 'work', 'hope', 'peace', 'love', 'strength'];

const emptyVerse: Partial<Verse> = {
  verse_text: '',
  reference: '',
  theme: 'wisdom',
  reflection: '',
  is_active: false,
  mode: 'automatic',
};

const AdminVerses = () => {
  const { adminSecret } = useAdmin();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [settings, setSettings] = useState<VerseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVerse, setEditingVerse] = useState<Partial<Verse> | null>(null);

  const fetchData = useCallback(async () => {
    if (!adminSecret) return;
    
    try {
      // Fetch verses
      const { data: versesData, error: versesError } = await supabase.functions.invoke('admin-data', {
        body: { action: 'list', table: 'verses', secret: adminSecret }
      });
      
      if (versesError) throw versesError;
      setVerses(versesData?.data || []);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase.functions.invoke('admin-data', {
        body: { action: 'list', table: 'verse_settings', secret: adminSecret }
      });
      
      if (settingsError) throw settingsError;
      
      if (settingsData?.data?.length > 0) {
        setSettings(settingsData.data[0]);
      } else {
        // Create default settings
        const { data: newSettings } = await supabase.functions.invoke('admin-data', {
          body: { 
            action: 'create', 
            table: 'verse_settings', 
            data: { enabled: true, mode: 'automatic', show_reflection: false, placement: 'homepage' },
            secret: adminSecret 
          }
        });
        if (newSettings?.data) {
          setSettings(newSettings.data);
        }
      }
    } catch (error) {
      console.error('Error fetching verse data:', error);
      toast({ title: 'Error', description: 'Failed to load verses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [adminSecret]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSettings = async (updates: Partial<VerseSettings>) => {
    if (!settings || !adminSecret) return;
    
    try {
      await supabase.functions.invoke('admin-data', {
        body: { action: 'update', table: 'verse_settings', id: settings.id, data: updates, secret: adminSecret }
      });
      setSettings({ ...settings, ...updates });
      toast({ title: 'Settings saved' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    }
  };

  const openCreateDialog = () => {
    setEditingVerse({ ...emptyVerse });
    setDialogOpen(true);
  };

  const openEditDialog = (verse: Verse) => {
    setEditingVerse({ ...verse });
    setDialogOpen(true);
  };

  const handleChange = (field: keyof Verse, value: any) => {
    if (editingVerse) {
      setEditingVerse({ ...editingVerse, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingVerse || !adminSecret) return;
    
    setSaving(true);
    try {
      if (editingVerse.id) {
        await supabase.functions.invoke('admin-data', {
          body: { action: 'update', table: 'verses', id: editingVerse.id, data: editingVerse, secret: adminSecret }
        });
      } else {
        await supabase.functions.invoke('admin-data', {
          body: { action: 'create', table: 'verses', data: editingVerse, secret: adminSecret }
        });
      }
      toast({ title: '✅ Saved successfully' });
      setDialogOpen(false);
      await fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save verse', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this verse?') || !adminSecret) return;
    
    try {
      await supabase.functions.invoke('admin-data', {
        body: { action: 'delete', table: 'verses', id, secret: adminSecret }
      });
      toast({ title: 'Verse deleted' });
      await fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete verse', variant: 'destructive' });
    }
  };

  const setActiveVerse = async (verseId: string) => {
    if (!adminSecret) return;
    
    try {
      // First deactivate all
      for (const v of verses.filter(v => v.is_active)) {
        await supabase.functions.invoke('admin-data', {
          body: { action: 'update', table: 'verses', id: v.id, data: { is_active: false }, secret: adminSecret }
        });
      }
      // Then activate selected
      await supabase.functions.invoke('admin-data', {
        body: { action: 'update', table: 'verses', id: verseId, data: { is_active: true }, secret: adminSecret }
      });
      toast({ title: 'Verse activated' });
      await fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to activate verse', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeVerse = verses.find(v => v.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Verse</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your verse of the day feature
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Verse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingVerse?.id ? 'Edit Verse' : 'Add New Verse'}</DialogTitle>
            </DialogHeader>
            {editingVerse && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Verse Text *</Label>
                  <Textarea
                    value={editingVerse.verse_text || ''}
                    onChange={(e) => handleChange('verse_text', e.target.value)}
                    placeholder="Enter the verse text..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reference *</Label>
                    <Input
                      value={editingVerse.reference || ''}
                      onChange={(e) => handleChange('reference', e.target.value)}
                      placeholder="e.g., Proverbs 16:3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={editingVerse.theme || 'wisdom'}
                      onValueChange={(v) => handleChange('theme', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((theme) => (
                          <SelectItem key={theme} value={theme} className="capitalize">
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Reflection (optional)</Label>
                    <AIWriterButtons
                      content={editingVerse.verse_text || ''}
                      onResult={(text) => handleChange('reflection', text)}
                      context={{ type: 'verse_reflection' }}
                    />
                  </div>
                  <Textarea
                    value={editingVerse.reflection || ''}
                    onChange={(e) => handleChange('reflection', e.target.value)}
                    placeholder="A brief reflection on this verse..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {editingVerse.id ? 'Save Changes' : 'Add Verse'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Verse of the Day</p>
              <p className="text-sm text-muted-foreground">Show verse on your public site</p>
            </div>
            <Switch
              checked={settings?.enabled ?? true}
              onCheckedChange={(checked) => updateSettings({ enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Reflection</p>
              <p className="text-sm text-muted-foreground">Display the reflection text below the verse</p>
            </div>
            <Switch
              checked={settings?.show_reflection ?? false}
              onCheckedChange={(checked) => updateSettings({ show_reflection: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select
                value={settings?.mode ?? 'automatic'}
                onValueChange={(v) => updateSettings({ mode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">🔄 Automatic (Daily rotation)</SelectItem>
                  <SelectItem value="manual">✋ Manual (You choose)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Placement</Label>
              <Select
                value={settings?.placement ?? 'homepage'}
                onValueChange={(v) => updateSettings({ placement: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">🏠 Homepage</SelectItem>
                  <SelectItem value="footer">📎 Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Verse Preview */}
      {activeVerse && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-green-500" />
              Currently Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="space-y-2">
              <p className="text-lg font-serif italic">"{activeVerse.verse_text}"</p>
              <footer className="text-sm font-medium text-primary">— {activeVerse.reference}</footer>
            </blockquote>
          </CardContent>
        </Card>
      )}

      {/* Verses List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Your Verses ({verses.length})</h2>
        {verses.map((verse) => (
          <Card key={verse.id} className={verse.is_active ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/20' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-primary">{verse.reference}</span>
                    <Badge variant="outline" className="text-xs capitalize">{verse.theme}</Badge>
                    {verse.is_active && (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 italic">"{verse.verse_text}"</p>
                </div>
                <div className="flex items-center gap-1">
                  {!verse.is_active && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setActiveVerse(verse.id)}
                      title="Set as active"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground hover:text-green-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(verse)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(verse.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {verses.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No verses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add some verses to display on your site</p>
              <Button onClick={openCreateDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Verse
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminVerses;
