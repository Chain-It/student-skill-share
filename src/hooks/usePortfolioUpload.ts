import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { PortfolioItem } from '@/lib/profile-types';
import type { Json } from '@/integrations/supabase/types';

export function usePortfolioUpload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const uploadFile = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
      return data.publicUrl;
    },
    onError: (error) => {
      toast.error('Failed to upload file', {
        description: error.message,
      });
    },
  });

  const addPortfolioItem = useMutation({
    mutationFn: async (item: Omit<PortfolioItem, 'id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');

      // Get current portfolio items
      const { data: profile } = await supabase
        .from('profiles')
        .select('portfolio_items')
        .eq('id', user.id)
        .single();

      const currentItems = (profile?.portfolio_items as unknown as PortfolioItem[]) || [];
      
      const newItem: PortfolioItem = {
        ...item,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          portfolio_items: [...currentItems, newItem] as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['freelancer-profile'] });
      toast.success('Portfolio item added!');
    },
    onError: (error) => {
      toast.error('Failed to add portfolio item', {
        description: error.message,
      });
    },
  });

  const removePortfolioItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('portfolio_items')
        .eq('id', user.id)
        .single();

      const currentItems = (profile?.portfolio_items as unknown as PortfolioItem[]) || [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);

      const { error } = await supabase
        .from('profiles')
        .update({
          portfolio_items: updatedItems as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['freelancer-profile'] });
      toast.success('Portfolio item removed');
    },
    onError: (error) => {
      toast.error('Failed to remove portfolio item', {
        description: error.message,
      });
    },
  });

  return {
    uploadFile,
    addPortfolioItem,
    removePortfolioItem,
  };
}
