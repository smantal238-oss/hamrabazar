import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import FixedHeader from '@/components/FixedHeader';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CategoryCircle from '@/components/CategoryCircle';
import CityCircle from '@/components/CityCircle';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, cities, type Listing } from '@shared/schema';
import { Plus, X } from 'lucide-react';

export default function HomePage() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('query', searchQuery);
  selectedCategories.forEach(cat => queryParams.append('category', cat));
  selectedCities.forEach(city => queryParams.append('city', city));
  
  const queryString = queryParams.toString();
  const queryKey = queryString ? `/api/listings?${queryString}` : '/api/listings';

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: [queryKey],
  });

  const handleSearch = (query: string, category: string, city: string) => {
    setSearchQuery(query);
    if (category && category !== 'all') {
      setSelectedCategories([category]);
    }
    if (city) {
      setSelectedCities([city]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCities([]);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCity = (cityId: string) => {
    setSelectedCities(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  const removeCity = (cityId: string) => {
    setSelectedCities(prev => prev.filter(id => id !== cityId));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return categoryId;
    if (language === 'fa') return category.nameFA;
    if (language === 'ps') return category.namePS;
    return category.nameEN;
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
  };

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{t('search')}</h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('allCategories')}</h2>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <div key={cat.id} className="relative">
                    <CategoryCircle
                      category={cat}
                      onClick={() => toggleCategory(cat.id)}
                    />
                    {selectedCategories.includes(cat.id) && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">شهرهای افغانستان</h2>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {cities.map(city => (
                  <div key={city.id} className="relative">
                    <CityCircle
                      city={city}
                      onClick={() => toggleCity(city.id)}
                    />
                    {selectedCities.includes(city.id) && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs text-accent-foreground">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(selectedCategories.length > 0 || selectedCities.length > 0 || searchQuery) && (
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => (
                  <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                    {getCategoryName(categoryId)}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeCategory(categoryId)}
                    />
                  </Badge>
                ))}
                {selectedCities.map(cityId => (
                  <Badge key={cityId} variant="outline" className="flex items-center gap-1">
                    {getCityName(cityId)}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeCity(cityId)}
                    />
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                data-testid="button-clear-filters"
                className="font-semibold"
              >
                {t('cancel')}
              </Button>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('recentListings')}</h2>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-6 bg-muted rounded w-1/3 mt-2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    currency={listing.currency}
                    category={listing.category}
                    city={listing.city}
                    imageUrl={listing.imageUrl || undefined}
                    createdAt={typeof listing.createdAt === 'string' ? listing.createdAt : (listing.createdAt ? new Date(listing.createdAt).toISOString() : new Date().toISOString())}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground">
                  {t('noResults')}
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
