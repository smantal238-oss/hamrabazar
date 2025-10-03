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
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, cities, type Listing } from '@shared/schema';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('query', searchQuery);
  if (selectedCategory) queryParams.append('category', selectedCategory);
  if (selectedCity) queryParams.append('city', selectedCity);
  
  const queryString = queryParams.toString();
  const queryKey = queryString ? `/api/listings?${queryString}` : '/api/listings';

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: [queryKey],
  });

  const handleSearch = (query: string, category: string, city: string) => {
    setSearchQuery(query);
    setSelectedCategory(category === 'all' ? '' : category);
    setSelectedCity(city);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
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
                  <CategoryCircle
                    key={cat.id}
                    category={cat}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedCity('');
                      setSearchQuery('');
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
                      setSearchQuery('');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {(selectedCategory || selectedCity || searchQuery) && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                data-testid="button-clear-filters"
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
