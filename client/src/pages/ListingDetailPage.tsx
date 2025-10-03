import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories, cities, type Listing, type User } from '@shared/schema';
import { Phone, MapPin, Clock, User as UserIcon, LogIn } from 'lucide-react';

export default function ListingDetailPage() {
  const [, params] = useRoute('/listing/:id');
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { user: currentUser } = useAuth();
  const listingId = params?.id;

  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['/api/listings', listingId],
    enabled: !!listingId,
  });

  const { data: seller } = useQuery<User>({
    queryKey: ['/api/user', listing?.userId],
    enabled: !!listing?.userId,
  });

  const getCategoryName = () => {
    if (!listing) return '';
    const cat = categories.find(c => c.id === listing.category);
    if (!cat) return listing.category;
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = () => {
    if (!listing) return '';
    const city = cities.find(c => c.id === listing.city);
    if (!city) return listing.city;
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
  };

  const getTimeAgo = () => {
    if (!listing?.createdAt) return '';
    const date = new Date(listing.createdAt);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FixedHeader showBackButton />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                </Card>
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <FixedHeader showBackButton />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <Card className="p-12 text-center">
              <p className="text-xl text-muted-foreground">
                {language === 'fa' ? 'آگهی یافت نشد' :
                 language === 'ps' ? 'اعلان ونه موندل شو' :
                 'Listing not found'}
              </p>
              <Button onClick={() => navigate('/')} className="mt-4">
                {language === 'fa' ? 'بازگشت به صفحه اصلی' :
                 language === 'ps' ? 'اصلي پاڼې ته راستنیدل' :
                 'Go to Home'}
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full aspect-video object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center text-8xl">
                    {categories.find(c => c.id === listing.category)?.icon || '📦'}
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2" data-testid="text-listing-title">
                        {listing.title}
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
                      ${listing.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">
                      {language === 'fa' ? 'توضیحات' : language === 'ps' ? 'تفصیل' : 'Description'}
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-listing-description">
                      {listing.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'fa' ? 'اطلاعات فروشنده' :
                     language === 'ps' ? 'د پلورونکي معلومات' :
                     'Seller Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground" data-testid="text-seller-name">
                      {seller?.name || language === 'fa' ? 'کاربر' : language === 'ps' ? 'کارن' : 'User'}
                    </span>
                  </div>
                  {currentUser ? (
                    <Button className="w-full" data-testid="button-contact-seller">
                      <Phone className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                      {language === 'fa' ? 'نمایش شماره تماس' :
                       language === 'ps' ? 'د تلیفون شمیره وګورئ' :
                       'Show Phone Number'}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        {language === 'fa' ? 'برای مشاهده شماره تماس، وارد شوید' :
                         language === 'ps' ? 'د تلیفون شمیره لیدلو لپاره، ننوځئ' :
                         'Login to see phone number'}
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => navigate('/auth')}
                        data-testid="button-login-to-contact"
                      >
                        <LogIn className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                        {t('login')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-foreground">
                    {language === 'fa' ? 'نکات ایمنی' :
                     language === 'ps' ? 'د خوندیتوب نکتې' :
                     'Safety Tips'}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {language === 'fa' ? 'قبل از پرداخت، محصول را بررسی کنید' :
                              language === 'ps' ? 'د تادیې دمخه، محصول وګورئ' :
                              'Inspect the item before payment'}</li>
                    <li>• {language === 'fa' ? 'در مکان عمومی ملاقات کنید' :
                              language === 'ps' ? 'په عامه ځای کې ولیدل شئ' :
                              'Meet in a public place'}</li>
                    <li>• {language === 'fa' ? 'از پیش‌پرداخت احتراز کنید' :
                              language === 'ps' ? 'له مخکینۍ تادیې ډډه وکړئ' :
                              'Avoid advance payments'}</li>
                  </ul>
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
