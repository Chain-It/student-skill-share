import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, AlertTriangle, X, FileIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetOrCreateChat,
  useChatMessages,
  useSendMessage,
  useRealtimeMessages,
  useMarkMessagesAsRead,
  type Message,
} from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface OrderChatProps {
  orderId: string;
  className?: string;
}

export function OrderChat({ orderId, className }: OrderChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch or create chat
  const { data: chat, isLoading: chatLoading, error: chatError } = useGetOrCreateChat(orderId);

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(chat?.id);

  // Realtime subscription
  useRealtimeMessages(chat?.id, !!chat);

  // Send message mutation
  const sendMessage = useSendMessage();

  // Mark as read mutation
  const markAsRead = useMarkMessagesAsRead();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (chat?.id) {
      markAsRead.mutate(chat.id);
    }
  }, [chat?.id, messages.length]);

  const handleSend = async () => {
    if (!chat || (!message.trim() && !file)) return;

    await sendMessage.mutateAsync({
      chatId: chat.id,
      content: message.trim(),
      file: file || undefined,
      orderId,
    });

    setMessage('');
    setFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 10MB limit
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (chatLoading) {
    return (
      <Card className={cn('flex items-center justify-center h-96', className)}>
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (chatError) {
    return (
      <Card className={cn('flex items-center justify-center h-96', className)}>
        <p className="text-destructive">Failed to load chat. Please try again.</p>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col h-[500px] md:h-[600px]', className)}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💬</span> Order Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Warning Banner */}
        <Alert variant="default" className="m-3 mb-0 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
            Keep all communication here until the order is completed. Sharing external contacts early may lead to account restrictions.
          </AlertDescription>
        </Alert>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender_id === user?.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* File Preview */}
        {file && (
          <div className="px-3 py-2 border-t bg-muted/50">
            <div className="flex items-center gap-2 text-sm">
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate flex-1">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t bg-background">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendMessage.isPending}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={sendMessage.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && !file) || sendMessage.isPending}
              size="icon"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Message Bubble Component
function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitial = () => {
    return message.sender?.username?.charAt(0).toUpperCase() || '?';
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)/i.test(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{getInitial()}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted rounded-bl-sm'
        )}
      >
        {!isOwn && message.sender?.username && (
          <p className="text-xs font-medium mb-1 opacity-70">
            {message.sender.username}
          </p>
        )}

        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {message.file_url && (
          <div className="mt-2">
            {isImage(message.file_url) ? (
              <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={message.file_url}
                  alt="Attachment"
                  className="max-w-full rounded-lg max-h-48 object-cover"
                />
              </a>
            ) : (
              <a
                href={message.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 text-sm underline',
                  isOwn ? 'text-primary-foreground' : 'text-foreground'
                )}
              >
                <FileIcon className="h-4 w-4" />
                View attachment
              </a>
            )}
          </div>
        )}

        <p
          className={cn(
            'text-[10px] mt-1',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </motion.div>
  );
}

export default OrderChat;
