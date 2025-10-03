import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { categories, cities } from '@shared/schema';
import FixedHeader from '@/components/FixedHeader';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ArrowRight } from 'lucide-react';

export default function CreateListingPage() {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    city: '',
    imageUrl: '',
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?.id || 'guest',
          price: parseInt(data.price),
        }),
      });
      if (!response.ok) throw new Error('Failed to create listing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: t('success') || 'موفقیت',
        description: language === 'fa' ? 'آگهی شما با موفقیت ثبت شد' : 
                     language === 'ps' ? 'ستاسو اعلان په بریالیتوب سره ثبت شو' :
                     'Your listing has been created successfully',
      });
      navigate('/');
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
    
    if (!user) {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: language === 'fa' ? 'لطفا ابتدا وارد شوید' :
                     language === 'ps' ? 'مهرباني وکړئ لومړی ننوځئ' :
                     'Please login first',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

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

    createListingMutation.mutate(formData);
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

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <FixedHeader showBackButton />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'fa' ? 'ثبت آگهی جدید' :
                 language === 'ps' ? 'نوی اعلان ثبت کړئ' :
                 'Create New Listing'}
              </CardTitle>
              <CardDescription>
                {language === 'fa' ? 'اطلاعات آگهی خود را وارد کنید' :
                 language === 'ps' ? 'د خپل اعلان معلومات دننه کړئ' :
                 'Enter your listing details'}
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
                    placeholder={language === 'fa' ? 'عنوان آگهی را وارد کنید' :
                                language === 'ps' ? 'د اعلان سرلیک دننه کړئ' :
                                'Enter listing title'}
                    data-testid="input-listing-title"
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
                    placeholder={language === 'fa' ? 'توضیحات کامل آگهی خود را بنویسید' :
                                language === 'ps' ? 'د خپل اعلان بشپړ تفصیل ولیکئ' :
                                'Write complete description'}
                    rows={5}
                    data-testid="input-listing-description"
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
                      placeholder="0"
                      data-testid="input-listing-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {language === 'fa' ? 'دسته‌بندی' : language === 'ps' ? 'کټګورۍ' : 'Category'}
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category" data-testid="select-listing-category">
                        <SelectValue placeholder={language === 'fa' ? 'انتخاب کنید' :
                                                  language === 'ps' ? 'انتخاب کړئ' :
                                                  'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} data-testid={`option-category-${cat.id}`}>
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
                    <SelectTrigger id="city" data-testid="select-listing-city">
                      <SelectValue placeholder={language === 'fa' ? 'انتخاب کنید' :
                                                language === 'ps' ? 'انتخاب کړئ' :
                                                'Select'} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.id} value={city.id} data-testid={`option-city-${city.id}`}>
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
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-listing-image"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    data-testid="button-cancel"
                  >
                    {language === 'fa' ? 'انصراف' : language === 'ps' ? 'لغوه کول' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createListingMutation.isPending}
                    data-testid="button-create-listing"
                  >
                    {createListingMutation.isPending ? 
                      (language === 'fa' ? 'در حال ثبت...' :
                       language === 'ps' ? 'د ثبت په حال کې...' :
                       'Creating...') :
                      (language === 'fa' ? 'ثبت آگهی' :
                       language === 'ps' ? 'اعلان ثبت کړئ' :
                       'Create Listing')}
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
