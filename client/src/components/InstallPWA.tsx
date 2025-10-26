import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InstallPWA() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom">
      <button
        onClick={() => setShowInstall(false)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Download className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {language === 'fa' ? 'نصب اپلیکیشن' : language === 'ps' ? 'اپلیکیشن نصب کړئ' : 'Install App'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {language === 'fa' ? 'همراه بازار را روی گوشی خود نصب کنید' :
             language === 'ps' ? 'همراه بازار په خپل موبایل کې نصب کړئ' :
             'Install Hamrah Bazar on your device'}
          </p>
          <Button onClick={handleInstall} size="sm" className="w-full">
            {language === 'fa' ? 'نصب' : language === 'ps' ? 'نصب' : 'Install'}
          </Button>
        </div>
      </div>
    </div>
  );
}
