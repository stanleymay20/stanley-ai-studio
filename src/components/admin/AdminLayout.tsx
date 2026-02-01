import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  User, 
  FolderOpen, 
  BookOpen, 
  Video, 
  LogOut,
  Home,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
  { path: '/admin/profile', label: 'Profile', icon: User, description: 'Edit your info' },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen, description: 'Manage projects' },
  { path: '/admin/books', label: 'Books', icon: BookOpen, description: 'Book collection' },
  { path: '/admin/videos', label: 'Videos', icon: Video, description: 'Video content' },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="ml-3 font-semibold text-foreground">Admin Dashboard</span>
      </header>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 lg:w-20",
          "lg:top-0"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center border-b border-border px-4">
            <div className={cn(
              "flex items-center gap-3 transition-opacity",
              !sidebarOpen && "lg:opacity-0"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <div className={cn(!sidebarOpen && "hidden")}>
                <h1 className="text-sm font-semibold text-foreground">Stanley Admin</h1>
                <p className="text-xs text-muted-foreground">Portfolio Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            <p className={cn(
              "text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2",
              !sidebarOpen && "lg:hidden"
            )}>
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary-foreground")} />
                  <div className={cn("flex-1 min-w-0", !sidebarOpen && "lg:hidden")}>
                    <span className="block truncate">{item.label}</span>
                    <span className={cn(
                      "text-xs truncate block",
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    !sidebarOpen && "lg:hidden"
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3 space-y-2">
            <Link to="/" target="_blank">
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start gap-2 h-10 text-sm",
                  !sidebarOpen && "lg:justify-center lg:px-2"
                )}
              >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className={cn(!sidebarOpen && "lg:hidden")}>View Site</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-2 h-10 text-sm text-muted-foreground hover:text-foreground",
                !sidebarOpen && "lg:justify-center lg:px-2"
              )}
              onClick={logout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className={cn(!sidebarOpen && "lg:hidden")}>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all duration-300 pt-14 lg:pt-0",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
