import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, BookOpen, Video, User, ArrowRight, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  const { adminSecret } = useAdmin();
  const [stats, setStats] = useState({
    projects: 0,
    books: 0,
    videos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminSecret) return;

      try {
        const [projectsRes, booksRes, videosRes] = await Promise.all([
          supabase.functions.invoke('admin-data', { 
            body: { action: 'list', table: 'projects', secret: adminSecret } 
          }),
          supabase.functions.invoke('admin-data', { 
            body: { action: 'list', table: 'books', secret: adminSecret } 
          }),
          supabase.functions.invoke('admin-data', { 
            body: { action: 'list', table: 'videos', secret: adminSecret } 
          }),
        ]);

        setStats({
          projects: projectsRes.data?.data?.length || 0,
          books: booksRes.data?.data?.length || 0,
          videos: videosRes.data?.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminSecret]);

  const statCards = [
    { 
      title: 'Projects', 
      value: stats.projects, 
      icon: FolderOpen, 
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-500',
      link: '/admin/projects',
      description: 'Portfolio items'
    },
    { 
      title: 'Books', 
      value: stats.books, 
      icon: BookOpen, 
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-500',
      link: '/admin/books',
      description: 'Publications'
    },
    { 
      title: 'Videos', 
      value: stats.videos, 
      icon: Video, 
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-500',
      link: '/admin/videos',
      description: 'Media content'
    },
  ];

  const quickActions = [
    { label: 'Add Project', icon: FolderOpen, path: '/admin/projects', color: 'bg-blue-500' },
    { label: 'Add Book', icon: BookOpen, path: '/admin/books', color: 'bg-green-500' },
    { label: 'Add Video', icon: Video, path: '/admin/videos', color: 'bg-purple-500' },
    { label: 'Edit Profile', icon: User, path: '/admin/profile', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 border border-border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Welcome back</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground max-w-lg">
            Manage your portfolio content from here. Add projects, books, videos, and update your profile.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-foreground">
                      {loading ? '—' : stat.value}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.path}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 border-border/50"
                  >
                    <div className={`p-2 rounded-lg ${action.color}/10`}>
                      <Icon className={`h-5 w-5 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">1. Update Your Profile</h4>
              <p className="text-sm">Add your photo, bio, skills, and contact information to personalize your portfolio.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">2. Add Projects</h4>
              <p className="text-sm">Showcase your best work by adding projects with descriptions and tech stacks.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">3. Add Books & Videos</h4>
              <p className="text-sm">Share your publications, recommended reads, and video content.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">4. Publish Content</h4>
              <p className="text-sm">Use the "Published" toggle to control what appears on your public portfolio.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
