import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectCaseStudyPage = lazy(() => import("./pages/ProjectCaseStudyPage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const AdminIndex = lazy(() => import("./pages/admin/index"));
const AdminProfilePage = lazy(() => import("./pages/admin/ProfilePage"));
const AdminProjectsPage = lazy(() => import("./pages/admin/ProjectsPage"));
const AdminBooksPage = lazy(() => import("./pages/admin/BooksPage"));
const AdminVideosPage = lazy(() => import("./pages/admin/VideosPage"));
const AdminMediaPage = lazy(() => import("./pages/admin/MediaPage"));
const AdminVersesPage = lazy(() => import("./pages/admin/VersesPage"));
const AdminCoursesPage = lazy(() => import("./pages/admin/CoursesPage"));
const SiteSettingsPage = lazy(() => import("./pages/admin/SiteSettingsPage"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Loading page" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectCaseStudyPage />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
