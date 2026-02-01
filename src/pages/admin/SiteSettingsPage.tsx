import { useAdmin } from '@/contexts/AdminContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminSiteSettings from './AdminSiteSettings';
import { Loader2 } from 'lucide-react';

const SiteSettingsPage = () => {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <AdminSiteSettings />
    </AdminLayout>
  );
};

export default SiteSettingsPage;
