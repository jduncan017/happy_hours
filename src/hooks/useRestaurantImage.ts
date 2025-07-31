import { useQuery } from '@tanstack/react-query';

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

export const useRestaurantImage = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurantImage', restaurantId],
    queryFn: () => fetchRestaurantImage(restaurantId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - images don't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 1,
    refetchOnWindowFocus: false,
  });
};