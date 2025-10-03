import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t, dir, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const getFooterText = (key: 'description' | 'quickLinks') => {
    if (key === 'description') {
      if (language === 'fa') return 'بزرگترین بازار آنلاین افغانستان برای خرید و فروش';
      if (language === 'ps') return 'د افغانستان ترټولو لوی آنلاین بازار د پیرودلو او خرڅلاو لپاره';
      return 'Afghanistan\'s largest online marketplace for buying and selling';
    }
    if (key === 'quickLinks') {
      if (language === 'fa') return 'لینک‌های مفید';
      if (language === 'ps') return 'ګړندي لینکونه';
      return 'Quick Links';
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8" style={{ direction: dir }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary" data-testid="text-footer-title">
              {t('appName')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getFooterText('description')}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold" data-testid="text-footer-links-title">
              {getFooterText('quickLinks')}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-home">
                  {t('home')}
                </span>
              </Link>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-about">
                {t('aboutUs')}
              </a>
              <a href="#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-terms">
                {t('termsOfService')}
              </a>
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-privacy">
                {t('privacyPolicy')}
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold" data-testid="text-footer-contact-title">
              {t('contactUs')}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span data-testid="text-footer-phone">+93 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span data-testid="text-footer-email">info@hamrahbazar.af</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span data-testid="text-footer-location">
                  {language === 'fa' ? 'کابل، افغانستان' : language === 'ps' ? 'کابل، افغانستان' : 'Kabul, Afghanistan'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © {currentYear} {t('appName')} - {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
