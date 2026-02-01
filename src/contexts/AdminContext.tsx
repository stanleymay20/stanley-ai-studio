import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (secret: string) => Promise<boolean>;
  logout: () => void;
  adminSecret: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Auto-logout after 30 minutes of inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset activity timer on user interaction
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Auto-logout check
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    };

    const intervalId = setInterval(checkInactivity, 60000); // Check every minute

    // Add activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetActivityTimer);
    });

    return () => {
      clearInterval(intervalId);
      events.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
    };
  }, [isAuthenticated, lastActivity, resetActivityTimer]);

  useEffect(() => {
    // Check for existing session in sessionStorage
    const storedSecret = sessionStorage.getItem('admin_secret');
    const storedTimestamp = sessionStorage.getItem('admin_session_time');
    
    if (storedSecret && storedTimestamp) {
      const sessionTime = parseInt(storedTimestamp, 10);
      const now = Date.now();
      
      // Check if session has expired
      if (now - sessionTime > INACTIVITY_TIMEOUT) {
        sessionStorage.removeItem('admin_secret');
        sessionStorage.removeItem('admin_session_time');
        setIsLoading(false);
        return;
      }
      
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
        console.error('Auth verification failed');
        return false;
      }

      if (data?.valid) {
        setIsAuthenticated(true);
        setAdminSecret(secret);
        setLastActivity(Date.now());
        sessionStorage.setItem('admin_secret', secret);
        sessionStorage.setItem('admin_session_time', Date.now().toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth verification failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (secret: string): Promise<boolean> => {
    setIsLoading(true);
    return verifySecret(secret);
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminSecret(null);
    sessionStorage.removeItem('admin_secret');
    sessionStorage.removeItem('admin_session_time');
  }, []);

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
