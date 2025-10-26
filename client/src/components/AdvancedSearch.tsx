import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SlidersHorizontal, X } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-low' | 'price-high';
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const { language } = useLanguage();
  const [show, setShow] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  const handleApply = () => {
    onSearch({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy,
    });
    setShow(false);
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    onSearch({});
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={() => setShow(!show)} className="w-full">
        <SlidersHorizontal className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
        {language === 'fa' ? 'جستجوی پیشرفته' : language === 'ps' ? 'پرمختللې لټون' : 'Advanced Search'}
      </Button>

      {show && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'fa' ? 'حداقل قیمت' : language === 'ps' ? 'لږترلږه قیمت' : 'Min Price'}</Label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'fa' ? 'حداکثر قیمت' : language === 'ps' ? 'ډیره قیمت' : 'Max Price'}</Label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'fa' ? 'مرتبسازی' : language === 'ps' ? 'ترتیبول' : 'Sort By'}</Label>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    {language === 'fa' ? 'جدیدترین' : language === 'ps' ? 'نوی' : 'Newest'}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {language === 'fa' ? 'ارزانترین' : language === 'ps' ? 'ارزانه' : 'Price: Low to High'}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {language === 'fa' ? 'گرانترین' : language === 'ps' ? 'ګران' : 'Price: High to Low'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1">
                {language === 'fa' ? 'اعمال' : language === 'ps' ? 'پلي کول' : 'Apply'}
              </Button>
              <Button onClick={handleClear} variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
