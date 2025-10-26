import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareDialogProps {
  listingId: string;
  title: string;
}

export default function ShareDialog({ listingId, title }: ShareDialogProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/listing/${listingId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: language === 'fa' ? 'کپی شد' : language === 'ps' ? 'کاپي شو' : 'Copied',
      description: language === 'fa' ? 'لینک کپی شد' : language === 'ps' ? 'لینک کاپي شو' : 'Link copied',
    });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          {language === 'fa' ? 'اشتراکگذاری' : language === 'ps' ? 'شریکول' : 'Share'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'fa' ? 'اشتراکگذاری آگهی' : language === 'ps' ? 'اعلان شریکول' : 'Share Listing'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={url} readOnly />
            <Button onClick={copyToClipboard} size="icon">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={shareWhatsApp} variant="outline" className="w-full">
              <span className="text-xl ltr:mr-2 rtl:ml-2">📱</span>
              WhatsApp
            </Button>
            <Button onClick={shareTelegram} variant="outline" className="w-full">
              <span className="text-xl ltr:mr-2 rtl:ml-2">✈️</span>
              Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
