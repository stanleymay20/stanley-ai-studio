import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, BookOpen, Video, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  const { adminSecret } = useAdmin();
  const [stats, setStats] = useState({
    projects: 0,
    books: 0,
    videos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminSecret) return;

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
    };

    fetchStats();
  }, [adminSecret]);

  const statCards = [
    { title: 'Projects', value: stats.projects, icon: FolderOpen, color: 'text-blue-500' },
    { title: 'Books', value: stats.books, icon: BookOpen, color: 'text-green-500' },
    { title: 'Videos', value: stats.videos, icon: Video, color: 'text-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Use the sidebar navigation to manage your portfolio content:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li><strong>Profile</strong> - Update your personal information, bio, and contact links</li>
              <li><strong>Projects</strong> - Add, edit, or remove portfolio projects</li>
              <li><strong>Books</strong> - Manage your book collection and reading list</li>
              <li><strong>Videos</strong> - Add video content and presentations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
