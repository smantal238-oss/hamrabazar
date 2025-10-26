import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import FixedHeader from '@/components/FixedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { language, dir } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/user/${user?.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, avatar }),
      });
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data);
      toast({
        title: language === 'fa' ? 'موفقیت' : language === 'ps' ? 'بریالیتوب' : 'Success',
        description: language === 'fa' ? 'پروفایل بهروزرسانی شد' :
                     language === 'ps' ? 'پروفایل تازه شو' :
                     'Profile updated',
      });
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user?.id || '');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setAvatar(data.imageUrl);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'fa' ? 'پروفایل من' : language === 'ps' ? 'زما پروفایل' : 'My Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="text-4xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{language === 'fa' ? 'نام' : language === 'ps' ? 'نوم' : 'Name'}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{language === 'fa' ? 'بیوگرافی' : language === 'ps' ? 'ژوندلیک' : 'Bio'}</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder={language === 'fa' ? 'درباره خود بنویسید...' :
                              language === 'ps' ? 'د خپل ځان په اړه ولیکئ...' :
                              'Write about yourself...'}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === 'fa' ? 'ایمیل' : language === 'ps' ? 'ایمیل' : 'Email'}</Label>
                <Input value={user.email || user.phone} disabled />
              </div>

              <Button onClick={() => updateProfileMutation.mutate()} className="w-full" disabled={updateProfileMutation.isPending}>
                <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {updateProfileMutation.isPending ?
                  (language === 'fa' ? 'در حال ذخیره...' : language === 'ps' ? 'ساتل کیږي...' : 'Saving...') :
                  (language === 'fa' ? 'ذخیره تغییرات' : language === 'ps' ? 'بدلونونه وساتئ' : 'Save Changes')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
