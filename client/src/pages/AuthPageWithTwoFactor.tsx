import { useState } from 'react';
import { useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [loginData, setLoginData] = useState({
    countryCode: '+93',
    phone: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    countryCode: '+93',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fullPhone = loginData.countryCode + loginData.phone;
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password: loginData.password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: typeof data.message === 'string' ? data.message.slice(0, 100) : 'ورود ناموفق بود',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      if (data.requiresTwoFactor) {
        setShowTwoFactor(true);
        toast({
          title: 'کد تایید',
          description: 'کد تایید به شماره شما ارسال شد',
        });
      } else {
        login(data.user);
        toast({
          title: t('login'),
          description: 'ورود موفقیتآمیز بود',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در برقراری ارتباط',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fullPhone = loginData.countryCode + loginData.phone;
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          code: twoFactorCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: typeof data.message === 'string' ? data.message.slice(0, 100) : 'کد تایید نادرست است',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      login(data.user);
      toast({
        title: t('login'),
        description: 'ورود موفقیتآمیز بود',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در برقراری ارتباط',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
    
    try {
      const fullPhone = registerData.countryCode + registerData.phone;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          phone: fullPhone,
          password: registerData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: typeof data.message === 'string' ? data.message.slice(0, 100) : 'ثبتنام ناموفق بود',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      login(data.user);
      toast({
        title: t('register'),
        description: 'ثبتنام موفقیتآمیز بود',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در برقراری ارتباط',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
                  {!showTwoFactor ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-phone">{t('phoneNumber')}</Label>
                        <div className="flex gap-2">
                          <Select value={loginData.countryCode} onValueChange={(value) => setLoginData({ ...loginData, countryCode: value })}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+93">🇦🇫 افغانستان +93</SelectItem>
                              <SelectItem value="+98">🇮🇷 ایران +98</SelectItem>
                              <SelectItem value="+92">🇵🇰 پاکستان +92</SelectItem>
                              <SelectItem value="+90">🇹🇷 ترکیه +90</SelectItem>
                              <SelectItem value="+966">🇸🇦 عربستان +966</SelectItem>
                              <SelectItem value="+971">🇦🇪 امارات +971</SelectItem>
                              <SelectItem value="+1">🇺🇸 آمریکا +1</SelectItem>
                              <SelectItem value="+44">🇬🇧 انگلیس +44</SelectItem>
                              <SelectItem value="+49">🇩🇪 آلمان +49</SelectItem>
                              <SelectItem value="+33">🇫🇷 فرانسه +33</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="login-phone"
                            type="text"
                            placeholder="700111111"
                            value={loginData.phone}
                            onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            required
                            className="flex-1"
                            data-testid="input-login-phone"
                          />
                        </div>
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
                        className="w-full font-semibold"
                        disabled={isLoading}
                        data-testid="button-login-submit"
                      >
                        {isLoading ? t('loading') : t('login')}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleTwoFactorVerify} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="two-factor-code">کد تایید</Label>
                        <Input
                          id="two-factor-code"
                          type="text"
                          placeholder="123456"
                          value={twoFactorCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setTwoFactorCode(value);
                          }}
                          required
                          maxLength={6}
                          data-testid="input-two-factor-code"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 font-semibold"
                          onClick={() => {
                            setShowTwoFactor(false);
                            setTwoFactorCode('');
                          }}
                        >
                          {t('cancel')}
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 font-semibold"
                          disabled={isLoading}
                          data-testid="button-verify-2fa"
                        >
                          {isLoading ? t('loading') : 'تایید'}
                        </Button>
                      </div>
                    </form>
                  )}
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
                      <div className="flex gap-2">
                        <Select value={registerData.countryCode} onValueChange={(value) => setRegisterData({ ...registerData, countryCode: value })}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+93">🇦🇫 افغانستان +93</SelectItem>
                            <SelectItem value="+98">🇮🇷 ایران +98</SelectItem>
                            <SelectItem value="+92">🇵🇰 پاکستان +92</SelectItem>
                            <SelectItem value="+90">🇹🇷 ترکیه +90</SelectItem>
                            <SelectItem value="+966">🇸🇦 عربستان +966</SelectItem>
                            <SelectItem value="+971">🇦🇪 امارات +971</SelectItem>
                            <SelectItem value="+1">🇺🇸 آمریکا +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 انگلیس +44</SelectItem>
                            <SelectItem value="+49">🇩🇪 آلمان +49</SelectItem>
                            <SelectItem value="+33">🇫🇷 فرانسه +33</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="700123456"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          required
                          className="flex-1"
                          data-testid="input-register-phone"
                        />
                      </div>
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
                      <Label htmlFor="register-confirm-password">تایید رمز عبور</Label>
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
                      className="w-full font-semibold"
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
        </div>
      </main>
    </div>
  );
}