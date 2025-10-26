import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, Users } from "lucide-react";

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
  const [, navigate] = useLocation();
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

  const rejectListing = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟ پیام رد به کاربر ارسال میشود.')) return;
    try {
      await fetch(`/api/admin/reject-listing/${id}`, {
        method: 'POST',
        headers: { 'user-role': user.role }
      });
      fetchPendingListings();
    } catch (error) {
      console.error('Error rejecting listing:', error);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
      await fetch(`/api/admin/delete-listing/${id}`, {
        method: 'DELETE',
        headers: { 'user-role': user.role }
      });
      fetchPendingListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">پنل مدیریت</h1>
        <Button onClick={() => navigate('/admin/users')} variant="outline">
          <Users className="w-4 h-4 mr-2" />
          مدیریت کاربران
        </Button>
      </div>
      
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
                      <div className="flex gap-2 mr-4">
                        <Button 
                          onClick={() => approveListing(listing.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          تایید
                        </Button>
                        <Button 
                          onClick={() => rejectListing(listing.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-1" />
                          رد
                        </Button>
                        <Button 
                          onClick={() => deleteListing(listing.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          حذف
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
  );
}