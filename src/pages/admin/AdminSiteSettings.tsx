import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminSiteSettings, availableFonts, NavigationItem } from '@/hooks/useSiteSettings';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2, Type, Navigation, Footprints, Share2, Globe, MapPin } from 'lucide-react';

const AdminSiteSettings = () => {
  const { adminSecret } = useAdmin();
  const { settings, setSettings, loading, saving, fetchSettings, updateSettings } = useAdminSiteSettings();

  useEffect(() => {
    if (adminSecret) {
      fetchSettings(adminSecret);
    }
  }, [adminSecret, fetchSettings]);

  const handleChange = (field: string, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!adminSecret || !settings) return;
    
    const success = await updateSettings(adminSecret, settings);
    if (success) {
      toast({ title: 'Settings saved', description: 'Your site settings have been updated.' });
    } else {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    }
  };

  // Navigation helpers
  const addNavItem = () => {
    if (!settings) return;
    const newItems = [...settings.navigation_items, { label: '', href: '' }];
    handleChange('navigation_items', newItems);
  };

  const updateNavItem = (index: number, field: keyof NavigationItem, value: string) => {
    if (!settings) return;
    const newItems = [...settings.navigation_items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('navigation_items', newItems);
  };

  const removeNavItem = (index: number) => {
    if (!settings) return;
    const newItems = settings.navigation_items.filter((_, i) => i !== index);
    handleChange('navigation_items', newItems);
  };

  // Quick links helpers
  const addQuickLink = () => {
    if (!settings) return;
    const newItems = [...settings.footer_quick_links, { label: '', href: '' }];
    handleChange('footer_quick_links', newItems);
  };

  const updateQuickLink = (index: number, field: keyof NavigationItem, value: string) => {
    if (!settings) return;
    const newItems = [...settings.footer_quick_links];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('footer_quick_links', newItems);
  };

  const removeQuickLink = (index: number) => {
    if (!settings) return;
    const newItems = settings.footer_quick_links.filter((_, i) => i !== index);
    handleChange('footer_quick_links', newItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return <p className="text-muted-foreground">No settings found</p>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Customize fonts, navigation, footer, and more</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Typography
            </CardTitle>
            <CardDescription>Choose fonts for headings and body text</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Heading Font</Label>
              <Select
                value={settings.font_heading}
                onValueChange={(value) => handleChange('font_heading', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Used for section titles and headings</p>
            </div>

            <div className="space-y-2">
              <Label>Body Font</Label>
              <Select
                value={settings.font_body}
                onValueChange={(value) => handleChange('font_body', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Used for paragraphs and general text</p>
            </div>

            {/* Font Preview */}
            <div className="md:col-span-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <h3 style={{ fontFamily: `"${settings.font_heading}", sans-serif` }} className="text-2xl font-bold text-foreground mb-2">
                Heading Preview
              </h3>
              <p style={{ fontFamily: `"${settings.font_body}", sans-serif` }} className="text-foreground">
                This is how your body text will look. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
            <CardDescription>Your location shown in the profile sidebar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="location">Location Text</Label>
              <Input
                id="location"
                value={settings.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Based in Potsdam"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Header Navigation
              </CardTitle>
              <CardDescription>Links shown in the header menu</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addNavItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.navigation_items.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <Input
                  value={item.label}
                  onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                  placeholder="Label (e.g., Projects)"
                  className="flex-1"
                />
                <Input
                  value={item.href}
                  onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                  placeholder="Link (e.g., #projects)"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeNavItem(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {settings.navigation_items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No navigation items</p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-primary" />
              Footer Content
            </CardTitle>
            <CardDescription>Customize the footer section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="footer_tagline">Tagline</Label>
              <Textarea
                id="footer_tagline"
                value={settings.footer_tagline || ''}
                onChange={(e) => handleChange('footer_tagline', e.target.value)}
                placeholder="A brief description of what you do..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer_availability">Availability Status</Label>
              <Input
                id="footer_availability"
                value={settings.footer_availability || ''}
                onChange={(e) => handleChange('footer_availability', e.target.value)}
                placeholder="Available for freelance projects"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer_copyright">Copyright Text</Label>
              <Input
                id="footer_copyright"
                value={settings.footer_copyright || ''}
                onChange={(e) => handleChange('footer_copyright', e.target.value)}
                placeholder="All rights reserved."
              />
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Quick Links</Label>
                <Button variant="outline" size="sm" onClick={addQuickLink}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {settings.footer_quick_links.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={item.label}
                    onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Input
                    value={item.href}
                    onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                    placeholder="Link"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeQuickLink(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Social Links (Footer)
            </CardTitle>
            <CardDescription>Social media links shown in the footer</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social_github">GitHub URL</Label>
              <Input
                id="social_github"
                value={settings.social_github || ''}
                onChange={(e) => handleChange('social_github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_linkedin">LinkedIn URL</Label>
              <Input
                id="social_linkedin"
                value={settings.social_linkedin || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_twitter">Twitter/X URL</Label>
              <Input
                id="social_twitter"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_email">Contact Email</Label>
              <Input
                id="social_email"
                type="email"
                value={settings.social_email || ''}
                onChange={(e) => handleChange('social_email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              SEO & Branding
            </CardTitle>
            <CardDescription>Search engine and social sharing settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title</Label>
              <Input
                id="site_title"
                value={settings.site_title || ''}
                onChange={(e) => handleChange('site_title', e.target.value)}
                placeholder="Your Name | Your Title"
              />
              <p className="text-xs text-muted-foreground">Appears in browser tabs and search results</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Meta Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description || ''}
                onChange={(e) => handleChange('site_description', e.target.value)}
                placeholder="Brief description of your portfolio..."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Shown in search results (keep under 160 characters)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="og_image_url">Social Share Image URL</Label>
              <Input
                id="og_image_url"
                value={settings.og_image_url || ''}
                onChange={(e) => handleChange('og_image_url', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">Image shown when sharing on LinkedIn, Twitter, etc. (1200x630px recommended)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
