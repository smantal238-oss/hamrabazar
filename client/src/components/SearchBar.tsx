import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, cities } from '@shared/schema';

interface SearchBarProps {
  onSearch?: (query: string, category: string, city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, category, city);
    console.log('Search:', { query, category, city });
  };

  const getCategoryName = (cat: typeof categories[number]) => {
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = (cit: typeof cities[number]) => {
    if (language === 'fa') return cit.nameFA;
    if (language === 'ps') return cit.namePS;
    return cit.nameEN;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          data-testid="input-search-query"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]" data-testid="select-search-category">
            <SelectValue placeholder={t('selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id} data-testid={`option-category-${cat.id}`}>
                {cat.icon} {getCategoryName(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full md:w-[180px]" data-testid="select-search-city">
            <SelectValue placeholder={t('selectCity')} />
          </SelectTrigger>
          <SelectContent>
            {cities.map(cit => (
              <SelectItem key={cit.id} value={cit.id} data-testid={`option-city-${cit.id}`}>
                {cit.icon} {getCityName(cit)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full md:w-auto" data-testid="button-search">
          <Search className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          {t('search')}
        </Button>
      </div>
    </form>
  );
}
