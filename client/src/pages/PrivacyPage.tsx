import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { language } = useLanguage();

  const getContent = () => {
    if (language === 'fa') {
      return {
        title: 'حریم خصوصی',
        content: 'ما متعهد به حفاظت از حریم خصوصی شما هستیم. اطلاعات شخصی شما با کامل امنیت محافظت میشود.'
      };
    }
    if (language === 'ps') {
      return {
        title: 'د محرمیت پالیسي',
        content: 'موږ ستاسو د محرمیت د ساتنې ژمنه کوو. ستاسو شخصي معلومات د بشپړ امنیت سره ساتل کیږي.'
      };
    }
    return {
      title: 'Privacy Policy',
      content: 'We are committed to protecting your privacy. Your personal information is protected with complete security.'
    };
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
            <p className="text-lg text-muted-foreground">{content.content}</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}