import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { categories, cities, type Listing } from '@shared/schema';
import FixedHeader from '@/components/FixedHeader';
import { queryClient } from '@/lib/queryClient';

export default function EditListingPage() {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams();
  const listingId = params.id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    city: '',
    imageUrl: '',
  });

  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['/api/listings', listingId],
    enabled: !!listingId,
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        category: listing.category,
        city: listing.city,
        imageUrl: listing.imageUrl || '',
      });
    }
  }, [listing]);

  const updateListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseInt(data.price),
        }),
      });
      if (!response.ok) throw new Error('Failed to update listing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings', listingId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.id, 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: language === 'fa' ? 'موفقیت' : language === 'ps' ? 'بریالیتوب' : 'Success',
        description: language === 'fa' ? 'آگهی با موفقیت به‌روزرسانی شد' :
                     language === 'ps' ? 'اعلان په بریالیتوب سره تازه شو' :
                     'Listing updated successfully',
      });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.city) {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: language === 'fa' ? 'لطفا تمام فیلدها را پر کنید' :
                     language === 'ps' ? 'مهرباني وکړئ ټول برخې ډک کړئ' :
                     'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    updateListingMutation.mutate(formData);
  };

  const getCategoryName = (cat: typeof categories[number]) => {
    if (language === 'fa') return cat.nameFA;
    if (language === 'ps') return cat.namePS;
    return cat.nameEN;
  };

  const getCityName = (city: typeof cities[number]) => {
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" style={{ direction: dir }}>
        <FixedHeader showBackButton />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'fa' ? 'ویرایش آگهی' :
                 language === 'ps' ? 'اعلان سمون' :
                 'Edit Listing'}
              </CardTitle>
              <CardDescription>
                {language === 'fa' ? 'اطلاعات آگهی خود را به‌روزرسانی کنید' :
                 language === 'ps' ? 'د خپل اعلان معلومات تازه کړئ' :
                 'Update your listing details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {language === 'fa' ? 'عنوان' : language === 'ps' ? 'سرلیک' : 'Title'}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    data-testid="input-edit-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {language === 'fa' ? 'توضیحات' : language === 'ps' ? 'تفصیل' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    data-testid="input-edit-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {language === 'fa' ? 'قیمت (دلار)' : language === 'ps' ? 'قیمت (ډالر)' : 'Price (USD)'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      data-testid="input-edit-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {language === 'fa' ? 'دسته‌بندی' : language === 'ps' ? 'کټګورۍ' : 'Category'}
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category" data-testid="select-edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {getCategoryName(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    {language === 'fa' ? 'شهر' : language === 'ps' ? 'ښار' : 'City'}
                  </Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger id="city" data-testid="select-edit-city">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.icon} {getCityName(city)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">
                    {language === 'fa' ? 'لینک تصویر (اختیاری)' :
                     language === 'ps' ? 'د انځور لینک (اختیاري)' :
                     'Image URL (optional)'}
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    data-testid="input-edit-image"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    data-testid="button-cancel-edit"
                  >
                    {language === 'fa' ? 'انصراف' : language === 'ps' ? 'لغوه کول' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateListingMutation.isPending}
                    data-testid="button-update-listing"
                  >
                    {updateListingMutation.isPending ?
                      (language === 'fa' ? 'در حال به‌روزرسانی...' :
                       language === 'ps' ? 'د تازه کولو په حال کې...' :
                       'Updating...') :
                      (language === 'fa' ? 'به‌روزرسانی' :
                       language === 'ps' ? 'تازه کول' :
                       'Update')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
