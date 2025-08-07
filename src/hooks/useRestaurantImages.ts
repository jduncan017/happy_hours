import { useQueries } from '@tanstack/react-query';
import type { Restaurant } from '@/lib/types';

interface RestaurantImageResponse {
  success: boolean;
  data?: {
    imageUrl: string;
    cached: boolean;
  };
  error?: string;
}

const fetchRestaurantImage = async (restaurantId: string): Promise<string> => {
  const response = await fetch(`/api/restaurants/${restaurantId}/image`);
  const data: RestaurantImageResponse = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch restaurant image');
  }
  
  return data.data!.imageUrl;
};

/**
 * Hook to pre-load images for multiple restaurants using React Query
 * Returns a record of restaurant IDs mapped to their image URLs
 */
export const useRestaurantImages = (restaurants: Restaurant[]) => {
  const queries = useQueries({
    queries: restaurants.map((restaurant) => ({
      queryKey: ['restaurantImage', restaurant.id],
      queryFn: () => fetchRestaurantImage(restaurant.id),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours - images don't change often
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      retry: 1,
      refetchOnWindowFocus: false,
    })),
  });

  // Transform results into a record of restaurantId -> imageUrl
  const restaurantImages: Record<string, string> = {};
  const isLoading = queries.some(query => query.isLoading);
  const hasErrors = queries.some(query => query.isError);

  queries.forEach((query, index) => {
    const restaurant = restaurants[index];
    if (query.data) {
      restaurantImages[restaurant.id] = query.data;
    } else if (query.isError) {
      // Provide fallback for failed images
      restaurantImages[restaurant.id] = "/photo-missing.webp";
    }
  });

  return {
    restaurantImages,
    isLoading,
    hasErrors,
    // Individual query states for debugging
    queries,
  };
};