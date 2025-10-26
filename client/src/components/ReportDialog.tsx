import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Flag } from 'lucide-react';
import { useLocation } from 'wouter';

interface ReportDialogProps {
  listingId: string;
}

export default function ReportDialog({ listingId }: ReportDialogProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const reasons = [
    { id: 'fraud', fa: 'کلاهبرداری', ps: 'درغلي', en: 'Fraud' },
    { id: 'inappropriate', fa: 'محتوای نامناسب', ps: 'نامناسب منځپانګه', en: 'Inappropriate Content' },
    { id: 'fake', fa: 'اطلاعات غلط', ps: 'غلط معلومات', en: 'False Information' },
    { id: 'spam', fa: 'اسپم', ps: 'سپم', en: 'Spam' },
    { id: 'other', fa: 'سایر', ps: 'نور', en: 'Other' },
  ];

  const reportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          reporterId: user?.id,
          reason,
          description,
        }),
      });
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === 'fa' ? 'گزارش ارسال شد' : language === 'ps' ? 'راپور ولیږل شو' : 'Report Sent',
        description: language === 'fa' ? 'گزارش شما با موفقیت ثبت شد' :
                     language === 'ps' ? 'ستاسو راپور په بریالیتوب سره ثبت شو' :
                     'Your report has been submitted',
      });
      setOpen(false);
      setReason('');
      setDescription('');
    },
  });

  const handleSubmit = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!reason) {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: language === 'fa' ? 'لطفا دلیل را انتخاب کنید' :
                     language === 'ps' ? 'مهرباني وکړئ دلیل انتخاب کړئ' :
                     'Please select a reason',
        variant: 'destructive',
      });
      return;
    }
    reportMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          {language === 'fa' ? 'گزارش' : language === 'ps' ? 'راپور' : 'Report'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'fa' ? 'گزارش آگهی' : language === 'ps' ? 'د اعلان راپور' : 'Report Listing'}
          </DialogTitle>
          <DialogDescription>
            {language === 'fa' ? 'لطفا دلیل گزارش را انتخاب کنید' :
             language === 'ps' ? 'مهرباني وکړئ د راپور دلیل انتخاب کړئ' :
             'Please select the reason for reporting'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {reasons.map(r => (
              <div key={r.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value={r.id} id={r.id} />
                <Label htmlFor={r.id} className="cursor-pointer">
                  {language === 'fa' ? r.fa : language === 'ps' ? r.ps : r.en}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div>
            <Label>
              {language === 'fa' ? 'توضیحات (اختیاری)' :
               language === 'ps' ? 'تفصیل (اختیاري)' :
               'Description (optional)'}
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'fa' ? 'توضیحات بیشتر...' :
                          language === 'ps' ? 'نور تفصیل...' :
                          'More details...'}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'fa' ? 'انصراف' : language === 'ps' ? 'لغوه' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={reportMutation.isPending}>
              {reportMutation.isPending ?
                (language === 'fa' ? 'در حال ارسال...' : language === 'ps' ? 'لیږل کیږي...' : 'Sending...') :
                (language === 'fa' ? 'ارسال گزارش' : language === 'ps' ? 'راپور ولیږئ' : 'Submit Report')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
