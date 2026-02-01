import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (secret: string) => Promise<boolean>;
  logout: () => void;
  adminSecret: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in sessionStorage
    const storedSecret = sessionStorage.getItem('admin_secret');
    if (storedSecret) {
      verifySecret(storedSecret);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifySecret = async (secret: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', secret }
      });

      if (error) {
        console.error('Auth verification error:', error);
        return false;
      }

      if (data?.valid) {
        setIsAuthenticated(true);
        setAdminSecret(secret);
        sessionStorage.setItem('admin_secret', secret);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (secret: string): Promise<boolean> => {
    setIsLoading(true);
    return verifySecret(secret);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminSecret(null);
    sessionStorage.removeItem('admin_secret');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout, adminSecret }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
