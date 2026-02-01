import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Certification } from '@/lib/profile-types';
import type { Json } from '@/integrations/supabase/types';

interface UpdateProfileData {
  username?: string;
  bio?: string | null;
  avatar_url?: string;
  professional_title?: string | null;
  location?: string | null;
  availability_hours?: string | null;
  skills?: string[];
  tools?: string[];
  response_time?: string | null;
  preferred_communication?: string[];
  education_program?: string | null;
  education_institution?: string | null;
  education_year?: number | null;
  education_level?: string | null;
  certifications?: Certification[];
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user) throw new Error('Not authenticated');

      // Prepare update payload, converting arrays for Supabase
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (data.username !== undefined) updatePayload.username = data.username;
      if (data.bio !== undefined) updatePayload.bio = data.bio;
      if (data.avatar_url !== undefined) updatePayload.avatar_url = data.avatar_url;
      if (data.professional_title !== undefined) updatePayload.professional_title = data.professional_title;
      if (data.location !== undefined) updatePayload.location = data.location;
      if (data.availability_hours !== undefined) updatePayload.availability_hours = data.availability_hours;
      if (data.skills !== undefined) updatePayload.skills = data.skills;
      if (data.tools !== undefined) updatePayload.tools = data.tools;
      if (data.response_time !== undefined) updatePayload.response_time = data.response_time;
      if (data.preferred_communication !== undefined) updatePayload.preferred_communication = data.preferred_communication;
      if (data.education_program !== undefined) updatePayload.education_program = data.education_program;
      if (data.education_institution !== undefined) updatePayload.education_institution = data.education_institution;
      if (data.education_year !== undefined) updatePayload.education_year = data.education_year;
      if (data.education_level !== undefined) updatePayload.education_level = data.education_level;
      if (data.certifications !== undefined) updatePayload.certifications = data.certifications as unknown as Json;

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['freelancer-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile', {
        description: error.message,
      });
    },
  });
}

export function useUploadAvatar() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if any
      await supabase.storage.from('avatars').remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      // Add timestamp to bust cache
      return `${data.publicUrl}?t=${Date.now()}`;
    },
    onError: (error) => {
      toast.error('Failed to upload avatar', {
        description: error.message,
      });
    },
  });
}
