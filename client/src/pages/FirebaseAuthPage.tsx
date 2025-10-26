import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import FixedHeader from '@/components/FixedHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function FirebaseAuthPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  const [phoneData, setPhoneData] = useState({
    countryCode: '+93',
    phone: '',
  });

  const ADMIN_PHONES = ['+93700000000', '+93700000001'];

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved')
      });
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fullPhone = phoneData.countryCode + phoneData.phone;
      setCurrentPhone(fullPhone);
      
      // Check if admin
      setIsAdminLogin(ADMIN_PHONES.includes(fullPhone));
      
      // Use backend for all users
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowVerification(true);
        toast({
          title: 'کد ارسال شد',
          description: data.message,
        });
      } else {
        toast({
          title: 'خطا',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'خطا',
        description: error.message || 'خطا در ارسال کد',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentPhone, code: verificationCode })
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        login(data.user);
        toast({
          title: 'ورود موفق',
          description: data.message,
        });
        
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: 'خطا',
          description: data.message || 'کد تایید نادرست است',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'خطا',
        description: 'کد تایید نادرست است',
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
                ورود با شماره تلفن
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showVerification ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تلفن</Label>
                    <div className="flex gap-2">
                      <Select value={phoneData.countryCode} onValueChange={(value) => setPhoneData({ ...phoneData, countryCode: value })}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+93">🇦🇫 +93</SelectItem>
                          <SelectItem value="+98">🇮🇷 +98</SelectItem>
                          <SelectItem value="+92">🇵🇰 +92</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="700000000"
                        value={phoneData.phone}
                        onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                    {isLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">کد تایید</Label>
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      maxLength={6}
                    />
                    {isAdminLogin && (
                      <p className="text-sm text-muted-foreground">
                        کد تایید در کنسول سرور نمایش داده شده است
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 font-semibold"
                      onClick={() => {
                        setShowVerification(false);
                        setVerificationCode('');
                        setIsAdminLogin(false);
                      }}
                    >
                      بازگشت
                    </Button>
                    <Button type="submit" className="flex-1 font-semibold" disabled={isLoading}>
                      {isLoading ? 'در حال تایید...' : 'تایید'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
