import { useState, useEffect } from 'react';
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

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

  // Check for Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get('googleAuth');
    const userStr = urlParams.get('user');
    
    if (googleAuth === 'success' && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(user);
        toast({
          title: 'ورود موفق',
          description: `خوش آمدید ${user.name}`,
        });
        navigate('/');
      } catch (error) {
        toast({
          title: 'خطا',
          description: 'خطا در ورود',
          variant: 'destructive',
        });
      }
    }
  }, [login, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: data.message || 'ورود ناموفق بود',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      login(data.user);
      toast({
        title: t('login'),
        description: 'ورود موفقیت‌آمیز بود',
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: data.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      setShowResetForm(true);
      toast({
        title: 'کد ارسال شد',
        description: 'کد بازیابی به ایمیل شما ارسال شد',
      });
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotEmail, 
          code: resetCode, 
          newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: data.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      login(data.user);
      toast({
        title: 'موفق',
        description: 'رمز عبور با موفقیت تغییر کرد',
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          phone: registerData.phone,
          password: registerData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: 'خطا',
          description: data.message || 'ثبت‌نام ناموفق بود',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      login(data.user);
      toast({
        title: t('register'),
        description: 'ثبت‌نام موفقیت‌آمیز بود',
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
                  <div className="space-y-4 mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                      onClick={() => window.location.href = '/api/auth/google'}
                    >
                      <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">ورود با Google</span>
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">یا</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">Gmail یا شماره تلفن</Label>
                      <Input
                        id="login-phone"
                        type="text"
                        placeholder="example@gmail.com یا +93 700 123 456"
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
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline w-full text-center"
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <div className="space-y-4 mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
                      onClick={() => window.location.href = '/api/auth/google'}
                    >
                      <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">ثبت نام با Google</span>
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">یا</span>
                      </div>
                    </div>
                  </div>
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

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForgotPassword(false)}>
            <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="text-xl text-center">بازیابی رمز عبور</CardTitle>
              </CardHeader>
              <CardContent>
                {!showResetForm ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Gmail</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        انصراف
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'در حال ارسال...' : 'ارسال کد'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-code">کد تایید</Label>
                      <Input
                        id="reset-code"
                        type="text"
                        placeholder="123456"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                        maxLength={6}
                      />
                      <p className="text-sm text-muted-foreground">
                        کد به {forgotEmail} ارسال شد
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">رمز عبور جدید</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        حداقل 4 کاراکتر (حروف، اعداد یا ترکیبی)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowResetForm(false);
                          setShowForgotPassword(false);
                        }}
                      >
                        انصراف
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'در حال تغییر...' : 'تغییر رمز'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
