import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminData } from '@/hooks/useAdminData';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { AIWriterButtons } from '@/components/admin/AIWriterButtons';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

interface CareerItem {
  title: string;
  company: string;
  period: string;
  description?: string;
}

interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
  photo_url: string | null;
  education: EducationItem[];
  career: CareerItem[];
  skills: string[];
  languages: { language: string; level: string }[];
  memberships: { organization: string; role: string }[];
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

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await updateItem(profile.id, profile);
    setSaving(false);
  };

  // Education helpers
  const addEducation = () => {
    if (!profile) return;
    const newEducation = [...(profile.education || []), { degree: '', institution: '', year: '' }];
    handleChange('education', newEducation);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    if (!profile) return;
    const newEducation = [...(profile.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    handleChange('education', newEducation);
  };

  const removeEducation = (index: number) => {
    if (!profile) return;
    const newEducation = (profile.education || []).filter((_, i) => i !== index);
    handleChange('education', newEducation);
  };

  // Career helpers
  const addCareer = () => {
    if (!profile) return;
    const newCareer = [...(profile.career || []), { title: '', company: '', period: '' }];
    handleChange('career', newCareer);
  };

  const updateCareer = (index: number, field: keyof CareerItem, value: string) => {
    if (!profile) return;
    const newCareer = [...(profile.career || [])];
    newCareer[index] = { ...newCareer[index], [field]: value };
    handleChange('career', newCareer);
  };

  const removeCareer = (index: number) => {
    if (!profile) return;
    const newCareer = (profile.career || []).filter((_, i) => i !== index);
    handleChange('career', newCareer);
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
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Photo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-48">
                <Label className="text-sm font-medium mb-2 block">Profile Photo</Label>
                <ImageUploader
                  value={profile.photo_url}
                  onChange={(url) => handleChange('photo_url', url)}
                  folder="profile"
                  aspectRatio="square"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title / Headline</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="AI Engineer | Data Scientist"
                  />
                </div>
              </div>
            </div>
            
            {/* Bio with AI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <AIWriterButtons
                  content={profile.bio || `${profile.name}, ${profile.title}`}
                  onResult={(text) => handleChange('bio', text)}
                  context={{ type: 'bio' }}
                />
              </div>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell visitors about yourself..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Links */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Social</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={profile.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={profile.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={(profile.skills || []).join(', ')}
              onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="Python, Machine Learning, React, TensorFlow..."
            />
            <p className="text-xs text-muted-foreground mt-2">Separate skills with commas</p>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(profile.education || []).map((edu, index) => (
              <div key={index} className="grid gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Degree (e.g., BSc Computer Science)"
                  />
                  <Input
                    value={edu.year || ''}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    placeholder="Year (e.g., 2020)"
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Institution name"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {(profile.education || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No education entries yet</p>
            )}
          </CardContent>
        </Card>

        {/* Career */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Career / Experience</CardTitle>
            <Button variant="outline" size="sm" onClick={addCareer}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(profile.career || []).map((job, index) => (
              <div key={index} className="grid gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={job.title || ''}
                    onChange={(e) => updateCareer(index, 'title', e.target.value)}
                    placeholder="Job title"
                  />
                  <Input
                    value={job.period || ''}
                    onChange={(e) => updateCareer(index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2020 - Present)"
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    value={job.company || ''}
                    onChange={(e) => updateCareer(index, 'company', e.target.value)}
                    placeholder="Company name"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeCareer(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {(profile.career || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No career entries yet</p>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={(profile.languages || []).map(l => `${l.language}: ${l.level}`).join('\n')}
              onChange={(e) => {
                const languages = e.target.value.split('\n').filter(Boolean).map(line => {
                  const [language, level] = line.split(':').map(s => s.trim());
                  return { language: language || '', level: level || '' };
                });
                handleChange('languages', languages);
              }}
              placeholder="English: Native&#10;Spanish: Fluent&#10;French: Intermediate"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-2">One language per line, format: Language: Level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
