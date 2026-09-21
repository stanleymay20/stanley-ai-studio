import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from "@/contexts/AdminContext";

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
      <Outlet />
    </Suspense>
  </AdminProvider>
);

export default AdminApp;
