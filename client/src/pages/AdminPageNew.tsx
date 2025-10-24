import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import FixedHeader from "@/components/FixedHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface PendingListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  imageUrl?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'admin') {
      toast({
        title: 'خطا',
        description: 'شما اجازه دسترسی به پنل مدیریت را ندارید',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    fetchPendingListings();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const fetchPendingListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pending-listings', {
        headers: { 'user-role': user.role }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingListings(data);
      } else {
        toast({
          title: 'خطا',
          description: 'خطا در بارگیری آگهیها',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      toast({
        title: 'خطا',
        description: 'خطا در ارتباط با سرور',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveListing = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/approve-listing/${id}`, {
        method: 'PATCH',
        headers: { 'user-role': user.role }
      });
      if (response.ok) {
        toast({
          title: 'موفق',
          description: 'آگهی با موفقیت تایید شد',
        });
        fetchPendingListings();
      } else {
        toast({
          title: 'خطا',
          description: 'خطا در تایید آگهی',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      toast({
        title: 'خطا',
        description: 'خطا در ارتباط با سرور',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FixedHeader showBackButton />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">پنل مدیریت</h1>
            <p className="text-muted-foreground">خوش آمدید {user.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">{pendingListings.length}</h3>
                  <p className="text-sm text-muted-foreground">آگهی در انتظار</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600">0</h3>
                  <p className="text-sm text-muted-foreground">آگهی تایید شده</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-600">0</h3>
                  <p className="text-sm text-muted-foreground">کاربران فعال</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>آگهیهای در انتظار تایید</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>در حال بارگیری...</p>
                </div>
              ) : pendingListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">هیچ آگهی در انتظار تایید وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <Card key={listing.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
                            <div className="flex gap-2 mt-3">
                              <Badge variant="secondary">{listing.category}</Badge>
                              <Badge variant="outline">{listing.city}</Badge>
                              <Badge variant="outline">${listing.price}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              تاریخ: {new Date(listing.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="flex gap-2 mr-4">
                            <Button 
                              onClick={() => approveListing(listing.id)}
                              className="font-semibold"
                            >
                              تایید
                            </Button>
                            <Button 
                              variant="destructive"
                              className="font-semibold"
                            >
                              رد
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}