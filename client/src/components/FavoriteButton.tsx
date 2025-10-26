import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useLocation } from 'wouter';

interface FavoriteButtonProps {
  listingId: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export default function FavoriteButton({ listingId, size = 'icon', variant = 'ghost' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: favorites = [] } = useQuery({
    queryKey: ['/api/favorites', user?.id],
    enabled: !!user?.id,
  });

  const isFavorite = favorites.some((f: any) => f.listingId === listingId);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${listingId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        if (!response.ok) throw new Error('Failed');
        return response.json();
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, listingId }),
        });
        if (!response.ok) throw new Error('Failed');
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', user?.id] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      className="relative"
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
    </Button>
  );
}
