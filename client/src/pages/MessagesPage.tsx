import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import FixedHeader from '@/components/FixedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowRight } from 'lucide-react';
import type { Message, Listing, User } from '@shared/schema';

export default function MessagesPage() {
  const [, params] = useRoute('/messages/:listingId');
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listingId = params?.listingId;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { data: listing } = useQuery<Listing>({
    queryKey: ['/api/listings', listingId],
    enabled: !!listingId,
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages/listing', listingId, user?.id],
    enabled: !!listingId && !!user?.id,
    refetchInterval: 3000,
  });

  const { data: seller } = useQuery<User>({
    queryKey: ['/api/user', listing?.userId],
    enabled: !!listing?.userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          senderId: user?.id,
          receiverId: listing?.userId,
          content,
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/listing', listingId, user?.id] });
      setMessageText('');
    },
    onError: () => {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: language === 'fa' ? 'ارسال پیام ناموفق بود' : 
                     language === 'ps' ? 'پیغام ونه لیږل شو' : 
                     'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user || !listing) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-4 h-screen flex flex-col">
        <div className="container mx-auto px-4 max-w-4xl flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {seller?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {seller?.name || (language === 'fa' ? 'کاربر' : language === 'ps' ? 'کارن' : 'User')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {listing?.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/listing/${listingId}`)}
                >
                  {language === 'fa' ? 'مشاهده آگهی' : 
                   language === 'ps' ? 'اعلان وګورئ' : 
                   'View Listing'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">
                    {language === 'fa' ? 'در حال بارگذاری...' : 
                     language === 'ps' ? 'بارېږي...' : 
                     'Loading...'}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground text-center">
                    {language === 'fa' ? 'هنوز پیامی وجود ندارد\nاولین پیام را ارسال کنید' : 
                     language === 'ps' ? 'تر اوسه پیغام نشته\nلومړی پیغام ولیږئ' : 
                     'No messages yet\nSend the first message'}
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt!).toLocaleTimeString(
                            language === 'fa' ? 'fa-IR' : language === 'ps' ? 'ps-AF' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    language === 'fa' ? 'پیام خود را بنویسید...' : 
                    language === 'ps' ? 'خپل پیغام ولیکئ...' : 
                    'Type your message...'
                  }
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
