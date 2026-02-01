import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, Save } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
  photo_url: string | null;
  education: any[];
  career: any[];
  skills: any[];
  languages: any[];
  memberships: any[];
}

const AdminProfile = () => {
  const { data, loading, fetchData, updateItem } = useAdminData<Profile>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data.length > 0) {
      setProfile(data[0]);
    }
  }, [data]);

  const handleChange = (field: keyof Profile, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleJsonChange = (field: keyof Profile, value: string) => {
    try {
      const parsed = JSON.parse(value);
      handleChange(field, parsed);
    } catch {
      // Invalid JSON, don't update
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await updateItem(profile.id, profile);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground">No profile found</p>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-1">Update your personal information</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL</Label>
              <Input
                id="photo_url"
                value={profile.photo_url || ''}
                onChange={(e) => handleChange('photo_url', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={profile.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={profile.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills (JSON Array)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(profile.skills || [], null, 2)}
              onChange={(e) => handleJsonChange('skills', e.target.value)}
              rows={6}
              className="font-mono text-sm"
              placeholder='["Python", "Machine Learning", "React"]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education (JSON Array)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(profile.education || [], null, 2)}
              onChange={(e) => handleJsonChange('education', e.target.value)}
              rows={8}
              className="font-mono text-sm"
              placeholder='[{"degree": "BSc", "institution": "University", "year": "2024"}]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career (JSON Array)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(profile.career || [], null, 2)}
              onChange={(e) => handleJsonChange('career', e.target.value)}
              rows={8}
              className="font-mono text-sm"
              placeholder='[{"title": "Engineer", "company": "Company", "period": "2023-Present"}]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Languages (JSON Array)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(profile.languages || [], null, 2)}
              onChange={(e) => handleJsonChange('languages', e.target.value)}
              rows={4}
              className="font-mono text-sm"
              placeholder='[{"language": "English", "level": "Native"}]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memberships (JSON Array)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(profile.memberships || [], null, 2)}
              onChange={(e) => handleJsonChange('memberships', e.target.value)}
              rows={4}
              className="font-mono text-sm"
              placeholder='[{"organization": "IEEE", "role": "Member"}]'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
