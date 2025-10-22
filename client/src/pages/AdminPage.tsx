import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { user } = useAuth();
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-red-600">دسترسی غیرمجاز</h2>
            <p>شما اجازه دسترسی به این صفحه را ندارید.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const response = await fetch('/api/admin/pending-listings', {
        headers: { 'user-role': user.role }
      });
      const data = await response.json();
      setPendingListings(data);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
    }
  };

  const approveListing = async (id: string) => {
    try {
      await fetch(`/api/admin/approve-listing/${id}`, {
        method: 'PATCH',
        headers: { 'user-role': user.role }
      });
      fetchPendingListings();
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>آگهی‌های در انتظار تایید ({pendingListings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingListings.length === 0 ? (
            <p>هیچ آگهی در انتظار تایید وجود ندارد.</p>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{listing.category}</Badge>
                          <Badge variant="outline">{listing.city}</Badge>
                          <Badge variant="outline">${listing.price}</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => approveListing(listing.id)}
                        className="mr-4"
                      >
                        تایید
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}