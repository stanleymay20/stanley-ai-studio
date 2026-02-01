import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';

type TableName = 'profile' | 'projects' | 'books' | 'videos' | 'courses';

export function useAdminData<T>(table: TableName) {
  const { adminSecret } = useAdmin();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!adminSecret) return;
    
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'list', table, secret: adminSecret }
      });

      if (error) throw error;
      setData(result.data || []);
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      toast({ title: 'Error', description: `Failed to fetch ${table}`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [table, adminSecret]);

  const createItem = useCallback(async (itemData: Partial<T>) => {
    if (!adminSecret) return null;
    
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'create', table, data: itemData, secret: adminSecret }
      });

      if (error) throw error;
      toast({ title: 'Success', description: `${table} created successfully` });
      await fetchData();
      return result.data;
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      toast({ title: 'Error', description: `Failed to create ${table}`, variant: 'destructive' });
      return null;
    }
  }, [table, adminSecret, fetchData]);

  const updateItem = useCallback(async (id: string, itemData: Partial<T>) => {
    if (!adminSecret) return null;
    
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'update', table, id, data: itemData, secret: adminSecret }
      });

      if (error) throw error;
      toast({ title: 'Success', description: `${table} updated successfully` });
      await fetchData();
      return result.data;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      toast({ title: 'Error', description: `Failed to update ${table}`, variant: 'destructive' });
      return null;
    }
  }, [table, adminSecret, fetchData]);

  const deleteItem = useCallback(async (id: string) => {
    if (!adminSecret) return false;
    
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { action: 'delete', table, id, secret: adminSecret }
      });

      if (error) throw error;
      toast({ title: 'Success', description: `${table} deleted successfully` });
      await fetchData();
      return true;
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      toast({ title: 'Error', description: `Failed to delete ${table}`, variant: 'destructive' });
      return false;
    }
  }, [table, adminSecret, fetchData]);

  return { data, loading, fetchData, createItem, updateItem, deleteItem };
}
