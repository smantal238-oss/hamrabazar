import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories, cities } from '@shared/schema';
import { MapPin, Clock } from 'lucide-react';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  imageUrl?: string;
  createdAt: string;
  onClick?: () => void;
}

export default function ListingCard({
  id,
  title,
  price,
  category,
  city,
  imageUrl,
  createdAt,
  onClick,
}: ListingCardProps) {
  const { t, language } = useLanguage();

  const getCategoryName = () => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return category;
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = () => {
    const cit = cities.find(c => c.id === city);
    if (!cit) return city;
    if (language === 'fa') return cit.nameFA;
    if (language === 'ps') return cit.namePS;
    return cit.nameEN;
  };

  const getTimeAgo = () => {
    const date = new Date(createdAt);
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
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
      data-testid={`card-listing-${id}`}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categories.find(c => c.id === category)?.icon || '📦'}
          </div>
        )}
        <div className="absolute top-2 ltr:left-2 rtl:right-2">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
            {getCategoryName()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-2 line-clamp-2" data-testid={`text-title-${id}`}>
          {title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-accent" data-testid={`text-price-${id}`}>
            {price.toLocaleString()} {t('afghani')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{getCityName()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
