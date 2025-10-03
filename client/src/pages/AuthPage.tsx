import { useState } from 'react';
import { useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    //todo: remove mock functionality - implement real authentication
    setTimeout(() => {
      console.log('Login:', loginData);
      login({
        id: 'mock-user-' + Date.now(),
        name: loginData.phone,
        phone: loginData.phone,
      });
      toast({
        title: t('login'),
        description: 'ورود موفقیت‌آمیز بود',
      });
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'خطا',
        description: 'رمز عبور و تایید آن یکسان نیست',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    //todo: remove mock functionality - implement real registration
    setTimeout(() => {
      console.log('Register:', registerData);
      login({
        id: 'mock-user-' + Date.now(),
        name: registerData.name,
        phone: registerData.phone,
      });
      toast({
        title: t('register'),
        description: 'ثبت‌نام موفقیت‌آمیز بود',
      });
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('appName')}</CardTitle>
              <CardDescription className="text-center">
                {t('language') === 'fa' && 'به همراه بازار خوش آمدید'}
                {t('language') === 'ps' && 'د همراه بازار ته ښه راغلاست'}
                {t('language') === 'en' && 'Welcome to Hamrah Bazar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">{t('login')}</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">{t('register')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">{t('phoneNumber')}</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        placeholder="+93 700 123 456"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                        required
                        data-testid="input-login-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t('password')}</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-login-submit"
                    >
                      {isLoading ? t('loading') : t('login')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">{t('name')}</Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                        data-testid="input-register-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">{t('phoneNumber')}</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+93 700 123 456"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                        data-testid="input-register-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">{t('password')}</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        {t('language') === 'fa' ? 'تایید رمز عبور' : t('language') === 'ps' ? 'د پټ نوم تایید' : 'Confirm Password'}
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        data-testid="input-register-confirm-password"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-register-submit"
                    >
                      {isLoading ? t('loading') : t('register')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('language') === 'fa' && 'با ثبت‌نام، شما قوانین و مقررات همراه بازار را می‌پذیرید'}
            {t('language') === 'ps' && 'د نوم لیکنې سره، تاسو د همراه بازار قوانین منئ'}
            {t('language') === 'en' && 'By registering, you agree to Hamrah Bazar terms'}
          </p>
        </div>
      </main>
    </div>
  );
}
