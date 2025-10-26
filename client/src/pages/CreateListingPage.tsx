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
    currency: 'USD',
    category: '',
    city: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

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
        title: language === 'fa' ? '✅ موفقیت' : language === 'ps' ? '✅ بریالیتوب' : '✅ Success',
        description: language === 'fa' 
          ? 'شما موفقانه اطلاعات خود را وارد نمودید. به زودترین فرصت توسط ادمین صفحه چک شده و در بازار نمایش داده خواهد شد.\n\nبا احترام از سمت تیم سازنده'
          : language === 'ps' 
          ? 'تاسو په بریالیتوب سره خپل معلومات داخل کړل. په ډیر ژر وخت کې به د اډمین لخوا چک او په بازار کې به ښودل شي.\n\nد جوړونکي ټیم لخوا درناوی سره'
          : 'You have successfully submitted your information. Your listing will be reviewed by admin and displayed in the market soon.\n\nWith respect from the development team',
        duration: 8000,
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

    const priceNum = parseInt(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast({
        title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
        description: language === 'fa' ? 'قیمت باید عدد مثبت باشد' :
                     language === 'ps' ? 'قیمت باید مثبت عدد وي' :
                     'Price must be positive',
        variant: 'destructive',
      });
      return;
    }

    let imageUrl = '';
    let images: string[] = [];
    
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append('image', imageFile);
      formDataImage.append('userId', user.id);
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImage,
        });
        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.imageUrl;
      } catch (error) {
        toast({
          title: language === 'fa' ? 'خطا' : language === 'ps' ? 'تیروتنه' : 'Error',
          description: language === 'fa' ? 'خطا در آپلود تصویر' :
                       language === 'ps' ? 'د انځور په اپلوډ کې تیروتنه' :
                       'Error uploading image',
          variant: 'destructive',
        });
        return;
      }
    }

    if (additionalImages.length > 0) {
      const formDataImages = new FormData();
      additionalImages.forEach(file => formDataImages.append('images', file));
      formDataImages.append('userId', user.id);
      
      try {
        const uploadResponse = await fetch('/api/upload-multiple', {
          method: 'POST',
          body: formDataImages,
        });
        const uploadResult = await uploadResponse.json();
        images = uploadResult.imageUrls;
      } catch (error) {
        console.error('Error uploading additional images:', error);
      }
    }

    createListingMutation.mutate({ ...formData, imageUrl, images });
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {language === 'fa' ? 'قیمت' : language === 'ps' ? 'قیمت' : 'Price'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      data-testid="input-listing-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      {language === 'fa' ? 'واحد پول' : language === 'ps' ? 'د پیسو واحد' : 'Currency'}
                    </Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">💵 {language === 'fa' ? 'دلار' : language === 'ps' ? 'ډالر' : 'USD'}</SelectItem>
                        <SelectItem value="AFN">؋ {language === 'fa' ? 'افغانی' : language === 'ps' ? 'افغانۍ' : 'AFN'}</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Label htmlFor="image">
                    {language === 'fa' ? 'تصویر اصلی' :
                     language === 'ps' ? 'اصلي انځور' :
                     'Main Image'}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    data-testid="input-listing-image"
                  />
                  {imageFile && (
                    <div className="mt-2 relative inline-block">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => setImageFile(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-images">
                    {language === 'fa' ? 'تصاویر اضافی (حداکثر 5)' :
                     language === 'ps' ? 'اضافي انځورونه (تر 5 پورې)' :
                     'Additional Images (max 5)'}
                  </Label>
                  <Input
                    id="additional-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(0, 5);
                      setAdditionalImages(files);
                    }}
                  />
                  {additionalImages.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {additionalImages.map((file, i) => (
                        <div key={i} className="relative inline-block">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${i + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
