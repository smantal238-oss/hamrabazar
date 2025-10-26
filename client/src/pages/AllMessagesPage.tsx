import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import type { Message, Listing, User } from '@shared/schema';

export default function AllMessagesPage() {
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const [, navigate] = useLocation();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', user?.id],
    enabled: !!user?.id,
  });

  const uniqueConversations = messages.reduce((acc, msg) => {
    const key = msg.listingId;
    if (!acc[key]) {
      acc[key] = msg;
    } else if (new Date(msg.createdAt!) > new Date(acc[key].createdAt!)) {
      acc[key] = msg;
    }
    return acc;
  }, {} as Record<string, Message>);

  const conversationsList = Object.values(uniqueConversations);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">
            {language === 'fa' ? 'پیامها' : language === 'ps' ? 'پیغامونه' : 'Messages'}
          </h1>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-16 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : conversationsList.length > 0 ? (
            <div className="space-y-3">
              {conversationsList.map(msg => (
                <ConversationCard key={msg.id} message={msg} currentUserId={user.id} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                {language === 'fa' ? 'هنوز پیامی ندارید' : 
                 language === 'ps' ? 'تر اوسه پیغام نلرئ' : 
                 'No messages yet'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationCard({ message, currentUserId }: { message: Message; currentUserId: string }) {
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const { data: listing } = useQuery<Listing>({
    queryKey: ['/api/listings', message.listingId],
  });

  const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
  const { data: otherUser } = useQuery<User>({
    queryKey: ['/api/user', otherUserId],
  });

  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/messages/${message.listingId}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {otherUser?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold truncate">
                {otherUser?.name || (language === 'fa' ? 'کاربر' : language === 'ps' ? 'کارن' : 'User')}
              </p>
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(message.createdAt!).toLocaleDateString(
                  language === 'fa' ? 'fa-IR' : language === 'ps' ? 'ps-AF' : 'en-US'
                )}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {listing?.title}
            </p>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {message.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
