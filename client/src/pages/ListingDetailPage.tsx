import { useRoute, useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories, cities } from '@shared/schema';
import { Phone, MapPin, Clock, User, LogIn } from 'lucide-react';

export default function ListingDetailPage() {
  const [, params] = useRoute('/listing/:id');
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  //todo: remove mock functionality
  const mockListing = {
    id: params?.id || '1',
    title: 'تویوتا کرولا مدل ۲۰۲۰ - حالت عالی',
    description: 'خودرو در شرایط بسیار خوب، تک مالک، سرویس کامل، رنگ سفید، گیربکس اتوماتیک، کیلومتر کم. برای اطلاعات بیشتر با شماره زیر تماس بگیرید.',
    price: 25000,
    category: 'vehicles',
    city: 'kabul',
    phone: '+93 700 123 456',
    sellerName: 'احمد کریمی',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  };

  const getCategoryName = () => {
    const cat = categories.find(c => c.id === mockListing.category);
    if (!cat) return mockListing.category;
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = () => {
    const city = cities.find(c => c.id === mockListing.city);
    if (!city) return mockListing.city;
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
  };

  const getTimeAgo = () => {
    const date = new Date(mockListing.createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return language === 'fa' ? 'همین الان' : language === 'ps' ? 'اوس' : 'just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return language === 'fa' ? `${mins} دقیقه پیش` : language === 'ps' ? `${mins} دقیقې مخکې` : `${mins}m ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return language === 'fa' ? `${hours} ساعت پیش` : language === 'ps' ? `${hours} ساعته مخکې` : `${hours}h ago`;
    }
    const days = Math.floor(diff / 86400);
    return language === 'fa' ? `${days} روز پیش` : language === 'ps' ? `${days} ورځې مخکې` : `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <div className="aspect-video bg-muted flex items-center justify-center text-8xl">
                  {categories.find(c => c.id === mockListing.category)?.icon || '📦'}
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2" data-testid="text-listing-title">
                        {mockListing.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{getCityName()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{getCategoryName()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-accent" data-testid="text-listing-price">
                      {mockListing.price.toLocaleString()} {t('afghani')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('description')}</h3>
                    <p className="text-muted-foreground leading-relaxed" data-testid="text-listing-description">
                      {mockListing.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('contactSeller')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium" data-testid="text-seller-name">{mockListing.sellerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'fa' ? 'فروشنده' : language === 'ps' ? 'پلورونکی' : 'Seller'}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        console.log('Call seller:', mockListing.phone);
                        window.location.href = `tel:${mockListing.phone}`;
                      }}
                      data-testid="button-call-seller"
                    >
                      <Phone className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                      {mockListing.phone}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate('/auth')}
                      data-testid="button-login-required"
                    >
                      <LogIn className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                      {t('login')}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('category')}</span>
                    <span className="font-medium">{getCategoryName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('city')}</span>
                    <span className="font-medium">{getCityName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'fa' ? 'تاریخ انتشار' : language === 'ps' ? 'د خپرېدو نېټه' : 'Posted'}
                    </span>
                    <span className="font-medium">{getTimeAgo()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
