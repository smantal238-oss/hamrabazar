import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FixedHeader from '@/components/FixedHeader';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { categories, cities, type Listing } from '@shared/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/user', user?.id, 'listings'],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete listing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.id, 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: language === 'fa' ? 'موفقیت' : language === 'ps' ? 'بریالیتوب' : 'Success',
        description: language === 'fa' ? 'آگهی با موفقیت حذف شد' :
                     language === 'ps' ? 'اعلان په بریالیتوب سره لرې شو' :
                     'Listing deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return categoryId;
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
                {language === 'fa' ? 'آگهی‌های من' :
                 language === 'ps' ? 'زما اعلانونه' :
                 'My Listings'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'fa' ? 'مدیریت آگهی‌های خود' :
                 language === 'ps' ? 'د خپلو اعلاناتو مدیریت' :
                 'Manage your listings'}
              </p>
            </div>
            <Button onClick={() => navigate('/create-listing')} data-testid="button-create-new-listing">
              <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {language === 'fa' ? 'آگهی جدید' :
               language === 'ps' ? 'نوی اعلان' :
               'New Listing'}
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(listing => (
                <Card key={listing.id} className="overflow-hidden" data-testid={`card-my-listing-${listing.id}`}>
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {categories.find(c => c.id === listing.category)?.icon || '📦'}
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2" data-testid={`text-listing-title-${listing.id}`}>
                        {listing.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {getCategoryName(listing.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary" data-testid={`text-listing-price-${listing.id}`}>
                        ${listing.price.toLocaleString()}
                      </span>
                      <Badge variant="outline">
                        {getCityName(listing.city)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                        data-testid={`button-edit-${listing.id}`}
                      >
                        <Pencil className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                        {language === 'fa' ? 'ویرایش' :
                         language === 'ps' ? 'سمون' :
                         'Edit'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            data-testid={`button-delete-${listing.id}`}
                          >
                            <Trash2 className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            {language === 'fa' ? 'حذف' :
                             language === 'ps' ? 'لرې کول' :
                             'Delete'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {language === 'fa' ? 'آیا مطمئن هستید؟' :
                               language === 'ps' ? 'ایا تاسو ډاډه یاست؟' :
                               'Are you sure?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === 'fa' ? 'این عمل قابل بازگشت نیست. آگهی شما برای همیشه حذف خواهد شد.' :
                               language === 'ps' ? 'دا عمل د بیرته راګرځیدو وړ نه دی. ستاسو اعلان د تل لپاره لرې کیږي.' :
                               'This action cannot be undone. Your listing will be permanently deleted.'}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {language === 'fa' ? 'انصراف' :
                               language === 'ps' ? 'لغوه کول' :
                               'Cancel'}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(listing.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {language === 'fa' ? 'حذف' :
                               language === 'ps' ? 'لرې کول' :
                               'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground">
                  {language === 'fa' ? 'شما هنوز آگهی ثبت نکرده‌اید' :
                   language === 'ps' ? 'تاسو تر اوسه اعلان ثبت نه دی کړی' :
                   'You haven\'t created any listings yet'}
                </p>
                <Button onClick={() => navigate('/create-listing')} data-testid="button-create-first-listing">
                  <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {language === 'fa' ? 'اولین آگهی خود را ثبت کنید' :
                   language === 'ps' ? 'خپل لومړی اعلان ثبت کړئ' :
                   'Create your first listing'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
