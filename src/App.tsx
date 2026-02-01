import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectsPage from "./pages/ProjectsPage";
import VideosPage from "./pages/VideosPage";
import CoursesPage from "./pages/CoursesPage";
import BooksPage from "./pages/BooksPage";
import AdminIndex from "./pages/admin/index";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminProjectsPage from "./pages/admin/ProjectsPage";
import AdminBooksPage from "./pages/admin/BooksPage";
import AdminVideosPage from "./pages/admin/VideosPage";
import AdminMediaPage from "./pages/admin/MediaPage";
import AdminVersesPage from "./pages/admin/VersesPage";
import AdminCoursesPage from "./pages/admin/CoursesPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
            <Route path="/admin/videos" element={<AdminVideosPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            <Route path="/admin/verses" element={<AdminVersesPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/settings" element={<SiteSettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
