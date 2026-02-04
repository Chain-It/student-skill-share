import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface Chat {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
}

// Get or create a chat for an order
export function useGetOrCreateChat(orderId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['chat', orderId],
    queryFn: async () => {
      if (!user || !orderId) return null;

      // First, try to get existing chat
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingChat) return existingChat as Chat;

      // If no chat exists, get the order to know buyer/seller
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('buyer_id, seller_id')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Order not found');

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert({
          order_id: orderId,
          buyer_id: order.buyer_id,
          seller_id: order.seller_id,
        })
        .select()
        .single();

      if (createError) {
        // Handle race condition - chat might have been created by the other party
        if (createError.code === '23505') {
          const { data: retryChat } = await supabase
            .from('chats')
            .select('*')
            .eq('order_id', orderId)
            .single();
          return retryChat as Chat;
        }
        throw createError;
      }

      return newChat as Chat;
    },
    enabled: !!user && !!orderId,
  });
}

// Get messages for a chat
export function useChatMessages(chatId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];

      // First get messages
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!messagesData) return [];

      // Then fetch sender profiles for each unique sender
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Combine messages with sender info
      const messagesWithSenders = messagesData.map(msg => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) || { username: 'Unknown', avatar_url: null },
      }));

      return messagesWithSenders as Message[];
    },
    enabled: !!user && !!chatId,
  });
}

// Send a message
export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      file,
      orderId,
    }: {
      chatId: string;
      content: string;
      file?: File;
      orderId: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      let fileUrl: string | null = null;

      // Upload file if provided
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${orderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get signed URL for private bucket
        const { data: signedData } = await supabase.storage
          .from('chat-files')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

        fileUrl = signedData?.signedUrl || null;
      }

      // Insert message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content || null,
          file_url: fileUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Subscribe to realtime messages
export function useRealtimeMessages(chatId: string | undefined, enabled: boolean = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId || !enabled) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: msgData } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (msgData) {
            // Fetch sender profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .eq('id', msgData.sender_id)
              .single();

            const newMessage = {
              ...msgData,
              sender: profile || { username: 'Unknown', avatar_url: null },
            };

            queryClient.setQueryData(['messages', chatId], (old: Message[] | undefined) => {
              if (!old) return [newMessage];
              // Avoid duplicates
              if (old.some((m) => m.id === newMessage.id)) return old;
              return [...old, newMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, enabled, queryClient]);
}

// Mark messages as read
export function useMarkMessagesAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });
}

// Get all chats for current user
export function useUserChats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-chats', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch chats with orders
      const { data: chatsData, error } = await supabase
        .from('chats')
        .select(`
          *,
          order:orders (
            id,
            status,
            gig:gigs (
              title,
              image_url
            )
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!chatsData) return [];

      // Get unique user IDs from buyer_id and seller_id
      const userIds = [...new Set(chatsData.flatMap(c => [c.buyer_id, c.seller_id]))];
      
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Combine chats with profile info
      return chatsData.map(chat => ({
        ...chat,
        buyer: profileMap.get(chat.buyer_id) || { username: 'Unknown', avatar_url: null },
        seller: profileMap.get(chat.seller_id) || { username: 'Unknown', avatar_url: null },
      }));
    },
    enabled: !!user,
  });
}
