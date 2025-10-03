import { useState } from 'react';
import { useLocation } from 'wouter';
import FixedHeader from '@/components/FixedHeader';
import SearchBar from '@/components/SearchBar';
import CategoryCircle from '@/components/CategoryCircle';
import CityCircle from '@/components/CityCircle';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, cities } from '@shared/schema';
import { Plus } from 'lucide-react';

//todo: remove mock functionality - this is mock data for design prototype
const generateMockListings = () => {
  const listings: Array<{
    id: string;
    title: string;
    price: number;
    category: string;
    city: string;
    createdAt: string;
  }> = [];
  const sampleTitles = {
    vehicles: ['تویوتا کرولا ۲۰۲۰', 'هوندا سیویک ۲۰۱۹', 'نیسان التیما ۲۰۲۱', 'بی ام و ۳۲۰i', 'مرسدس بنز C200'],
    realestate: ['آپارتمان ۳ خوابه', 'خانه ویلایی', 'زمین مسکونی', 'دفتر تجاری', 'مغازه کلان'],
    electronics: ['آیفون ۱۴ پرو', 'سامسونگ S23', 'لپ‌تاپ دل', 'تلویزیون ال جی', 'ایرپاد پرو'],
    jewelry: ['انگشتر طلا', 'گردنبند یاقوت', 'ساعت رولکس', 'النگو نقره', 'گوشواره الماس'],
    'mens-clothes': ['کت و شلوار', 'پیراهن رسمی', 'جین', 'کفش چرمی', 'ساعت مچی'],
    'womens-clothes': ['لباس مجلسی', 'مانتو', 'شلوار جین', 'کفش پاشنه', 'کیف دستی'],
    'kids-clothes': ['لباس نوزاد', 'کفش بچگانه', 'کلاه', 'کت بچگانه', 'شلوار ورزشی'],
    books: ['کتاب انگلیسی', 'دیکشنری', 'کتاب درسی', 'رمان', 'کتاب تاریخ'],
    kids: ['اسباب بازی', 'کالسکه', 'تخت کودک', 'پوشک', 'شیشه شیر'],
    home: ['مبل راحتی', 'یخچال', 'ماشین لباسشویی', 'فرش', 'میز ناهارخوری'],
    jobs: ['مهندس نرم‌افزار', 'حسابدار', 'راننده', 'فروشنده', 'معلم'],
    services: ['تعمیرات موبایل', 'نقاشی ساختمان', 'تدریس خصوصی', 'باربری', 'برقکاری'],
    games: ['پلی استیشن ۵', 'ایکس باکس', 'بازی فیفا', 'دسته بازی', 'هدست گیمینگ'],
    sports: ['دوچرخه', 'توپ فوتبال', 'کفش ورزشی', 'تردمیل', 'دمبل'],
  };

  const prices = [5000, 12000, 25000, 45000, 8000, 15000, 30000, 60000, 100000, 3000];

  categories.forEach((cat) => {
    cities.forEach((city) => {
      for (let i = 0; i < 4; i++) {
        const titles = sampleTitles[cat.id as keyof typeof sampleTitles] || ['محصول نمونه'];
        listings.push({
          id: `${cat.id}-${city.id}-${i}`,
          title: titles[i % titles.length],
          price: prices[Math.floor(Math.random() * prices.length)],
          category: cat.id,
          city: city.id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000).toISOString(),
        });
      }
    });
  });

  return listings.sort(() => Math.random() - 0.5);
};

export default function HomePage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  //todo: remove mock functionality
  const allListings = generateMockListings();
  
  const filteredListings = allListings.filter(listing => {
    if (selectedCategory && listing.category !== selectedCategory) return false;
    if (selectedCity && listing.city !== selectedCity) return false;
    return true;
  });

  const recentListings = filteredListings.slice(0, 24);

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{t('search')}</h2>
            <SearchBar onSearch={(q, cat, city) => {
              setSelectedCategory(cat);
              setSelectedCity(city);
              console.log('Search:', { q, cat, city });
            }} />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('allCategories')}</h2>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <CategoryCircle
                    key={cat.id}
                    category={cat}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedCity('');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('afghanCities')}</h2>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {cities.map(city => (
                  <CityCircle
                    key={city.id}
                    city={city}
                    onClick={() => {
                      setSelectedCity(city.id);
                      setSelectedCategory('');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {(selectedCategory || selectedCity) && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedCity('');
                }}
                data-testid="button-clear-filters"
              >
                {t('cancel')}
              </Button>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('recentListings')}</h2>
              <Button
                variant="default"
                onClick={() => navigate('/post-ad')}
                data-testid="button-post-ad"
              >
                <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {t('postAd')}
              </Button>
            </div>
            
            {recentListings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('noResults')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentListings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    {...listing}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-lg font-semibold mb-2">{t('appName')}</p>
          <p className="text-sm">
            {t('language') === 'fa' && 'بزرگترین بازار آنلاین افغانستان'}
            {t('language') === 'ps' && 'د افغانستان ترټولو لوی آنلاین بازار'}
            {t('language') === 'en' && "Afghanistan's Largest Online Marketplace"}
          </p>
        </div>
      </footer>
    </div>
  );
}
