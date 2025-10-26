import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import FixedHeader from '@/components/FixedHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { categories, cities, type Listing } from '@shared/schema';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const [, navigate] = useLocation();

  const { data: favorites = [] } = useQuery({
    queryKey: ['/api/favorites', user?.id],
    enabled: !!user?.id,
  });

  const { data: listings = [] } = useQuery<Listing[]>({
    queryKey: ['/api/listings'],
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (!response.ok) throw new Error('Failed to remove');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', user?.id] });
    },
  });

  const favoriteListings = listings.filter(l => 
    favorites.some((f: any) => f.listingId === l.id)
  );

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return categoryId;
    return language === 'fa' ? cat.nameFA : language === 'ps' ? cat.namePS : cat.nameEN;
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    return language === 'fa' ? city.nameFA : language === 'ps' ? city.namePS : city.nameEN;
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            {language === 'fa' ? 'علاقهمندیها' : language === 'ps' ? 'خوښې' : 'Favorites'}
          </h1>

          {favoriteListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteListings.map(listing => (
                <Card key={listing.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div onClick={() => navigate(`/listing/${listing.id}`)}>
                    <div className="aspect-[4/3] bg-muted relative">
                      {listing.imageUrl ? (
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          {categories.find(c => c.id === listing.category)?.icon || '📦'}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-2">{listing.title}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">${listing.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{getCategoryName(listing.category)}</span>
                        <span>{getCityName(listing.city)}</span>
                      </div>
                    </CardContent>
                  </div>
                  <div className="px-4 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => removeFavoriteMutation.mutate(listing.id)}
                    >
                      <Trash2 className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                      {language === 'fa' ? 'حذف' : language === 'ps' ? 'لرې کول' : 'Remove'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                {language === 'fa' ? 'هنوز آگهی به علاقهمندیها اضافه نکردهاید' :
                 language === 'ps' ? 'تر اوسه اعلان خوښو ته نه دی اضافه کړی' :
                 'No favorites yet'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
