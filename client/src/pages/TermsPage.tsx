import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { language } = useLanguage();

  const getContent = () => {
    if (language === 'fa') {
      return {
        title: 'شرایط استفاده',
        content: 'با استفاده از همراه بازار، شما با شرایط و قوانین ما موافقت میکنید. لطفاً این شرایط را به دقت مطالعه کنید.'
      };
    }
    if (language === 'ps') {
      return {
        title: 'د استعمال شرطونه',
        content: 'د همراه بازار څخه د کارونې سره، تاسو زموږ د شرطونو او قوانینو سره موافق یاست. مهرباني وکړئ دا شرطونه په دقت سره ولولئ.'
      };
    }
    return {
      title: 'Terms of Service',
      content: 'By using Hamrah Bazar, you agree to our terms and conditions. Please read these terms carefully.'
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