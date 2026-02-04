-- Create chats table (one chat per order)
CREATE TABLE public.chats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(order_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    content TEXT,
    file_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_chats_order_id ON public.chats(order_id);
CREATE INDEX idx_chats_buyer_id ON public.chats(buyer_id);
CREATE INDEX idx_chats_seller_id ON public.chats(seller_id);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chats table
CREATE POLICY "Users can view chats where they are buyer or seller"
ON public.chats
FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create chats for their orders"
ON public.chats
FOR INSERT
WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS policies for messages table
CREATE POLICY "Users can view messages in their chats"
ON public.messages
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chats
        WHERE chats.id = messages.chat_id
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
);

CREATE POLICY "Users can send messages in their chats"
ON public.messages
FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM public.chats
        WHERE chats.id = messages.chat_id
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
);

CREATE POLICY "Users can mark received messages as read"
ON public.messages
FOR UPDATE
USING (
    sender_id != auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.chats
        WHERE chats.id = messages.chat_id
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
)
WITH CHECK (
    sender_id != auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.chats
        WHERE chats.id = messages.chat_id
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('chat-files', 'chat-files', false, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat files
CREATE POLICY "Users can upload chat files for their orders"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'chat-files'
    AND EXISTS (
        SELECT 1 FROM public.chats
        WHERE (storage.foldername(name))[1] = chats.order_id::text
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
);

CREATE POLICY "Users can view chat files for their orders"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'chat-files'
    AND EXISTS (
        SELECT 1 FROM public.chats
        WHERE (storage.foldername(name))[1] = chats.order_id::text
        AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
);