import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ExtendedProfile, Certification, PortfolioItem, FreelancerStats } from '@/lib/profile-types';
import type { Json } from '@/integrations/supabase/types';

export function useFreelancerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['freelancer-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Parse JSONB fields with proper casting
      return {
        ...data,
        skills: (data.skills as string[]) || [],
        tools: (data.tools as string[]) || [],
        preferred_communication: (data.preferred_communication as string[]) || [],
        certifications: (data.certifications as unknown as Certification[]) || [],
        portfolio_items: (data.portfolio_items as unknown as PortfolioItem[]) || [],
        is_identity_verified: data.is_identity_verified || false,
      } as ExtendedProfile;
    },
    enabled: !!userId,
  });
}

export function useFreelancerStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['freelancer-stats', userId],
    queryFn: async (): Promise<FreelancerStats> => {
      if (!userId) {
        return { averageRating: 0, totalReviews: 0, completedOrders: 0 };
      }

      // Get completed orders count
      const { count: completedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', userId)
        .eq('status', 'delivered');

      // Get ratings for seller's gigs
      const { data: gigs } = await supabase
        .from('gigs')
        .select('id, average_rating, total_reviews')
        .eq('user_id', userId);

      let totalRating = 0;
      let totalReviews = 0;

      if (gigs && gigs.length > 0) {
        gigs.forEach(gig => {
          if (gig.average_rating && gig.total_reviews) {
            totalRating += (gig.average_rating * gig.total_reviews);
            totalReviews += gig.total_reviews;
          }
        });
      }

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      return {
        averageRating,
        totalReviews,
        completedOrders: completedOrders || 0,
      };
    },
    enabled: !!userId,
  });
}

export function useFreelancerGigs(userId: string | undefined) {
  return useQuery({
    queryKey: ['freelancer-gigs', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useFreelancerReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ['freelancer-reviews', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get all gigs by this user, then get ratings for those gigs
      const { data: gigs } = await supabase
        .from('gigs')
        .select('id')
        .eq('user_id', userId);

      if (!gigs || gigs.length === 0) return [];

      const gigIds = gigs.map(g => g.id);

      const { data: ratings, error } = await supabase
        .from('ratings')
        .select(`
          *,
          reviewer:profiles!ratings_reviewer_id_fkey(username, avatar_url),
          gig:gigs!ratings_gig_id_fkey(title)
        `)
        .in('gig_id', gigIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return ratings;
    },
    enabled: !!userId,
  });
}
