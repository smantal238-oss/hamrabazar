import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const getContent = () => {
    if (language === 'fa') {
      return {
        title: 'درباره همراه بازار',
        content: 'همراه بازار بزرگترین پلتفرم آنلاین خرید و فروش در افغانستان است که با هدف تسهیل تجارت و ارتباط بین مردم ایجاد شده است.'
      };
    }
    if (language === 'ps') {
      return {
        title: 'د همراه بازار په اړه',
        content: 'همراه بازار د افغانستان ترټولو لوی آنلاین د پیرودلو او خرڅلاو پلیټفارم دی چې د خلکو ترمنځ د سوداګرۍ او اړیکو د اسانتیا لپاره جوړ شوی.'
      };
    }
    return {
      title: 'About Hamrah Bazar',
      content: 'Hamrah Bazar is Afghanistan\'s largest online marketplace platform created to facilitate trade and communication between people.'
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