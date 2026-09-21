import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from "@/contexts/AdminContext";

const AdminIndex = lazy(() => import("@/pages/admin/index"));
const AdminProfilePage = lazy(() => import("@/pages/admin/ProfilePage"));
const AdminProjectsPage = lazy(() => import("@/pages/admin/ProjectsPage"));
const AdminBooksPage = lazy(() => import("@/pages/admin/BooksPage"));
const AdminVideosPage = lazy(() => import("@/pages/admin/VideosPage"));
const AdminMediaPage = lazy(() => import("@/pages/admin/MediaPage"));
const AdminVersesPage = lazy(() => import("@/pages/admin/VersesPage"));
const AdminCoursesPage = lazy(() => import("@/pages/admin/CoursesPage"));
const SiteSettingsPage = lazy(() => import("@/pages/admin/SiteSettingsPage"));

const AdminFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div
      className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
      aria-label="Loading admin"
    />
  </div>
);

const AdminApp = () => (
  <AdminProvider>
    <Toaster />
    <Suspense fallback={<AdminFallback />}>
      <Routes>
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/books" element={<AdminBooksPage />} />
        <Route path="/admin/videos" element={<AdminVideosPage />} />
        <Route path="/admin/media" element={<AdminMediaPage />} />
        <Route path="/admin/verses" element={<AdminVersesPage />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/settings" element={<SiteSettingsPage />} />
      </Routes>
    </Suspense>
  </AdminProvider>
);

export default AdminApp;
