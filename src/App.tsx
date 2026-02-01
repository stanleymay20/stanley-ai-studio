import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminIndex from "./pages/admin/index";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminProjectsPage from "./pages/admin/ProjectsPage";
import AdminBooksPage from "./pages/admin/BooksPage";
import AdminVideosPage from "./pages/admin/VideosPage";
import AdminMediaPage from "./pages/admin/MediaPage";

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
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
            <Route path="/admin/videos" element={<AdminVideosPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
