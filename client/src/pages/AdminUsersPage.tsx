import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle } from 'lucide-react';
import type { User } from '@shared/schema';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'admin',
  });

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {language === 'fa' ? 'مدیریت کاربران' : language === 'ps' ? 'د کاربرانو مدیریت' : 'Users Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email || u.phone}</p>
                      <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/message-user/${u.id}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {language === 'fa' ? 'پیام' : language === 'ps' ? 'پیغام' : 'Message'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
