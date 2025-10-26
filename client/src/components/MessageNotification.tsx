import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function MessageNotification() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ['/api/messages/unread', user?.id],
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  const count = data?.count || 0;

  if (count === 0) return null;

  return (
    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 text-xs">
      {count > 9 ? '9+' : count}
    </Badge>
  );
}
