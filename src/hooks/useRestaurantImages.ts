import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Restaurant } from "@/lib/types";

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
    return "/photo-missing.webp";
  }

  return data.data!.imageUrl;
};

/**
 * Hook to fetch a single restaurant's image
 */
export const useRestaurantImage = (restaurantId: string) => {
  return useQuery({
    queryKey: ["restaurantImage", restaurantId],
    queryFn: () => fetchRestaurantImage(restaurantId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - images don't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to pre-load images for multiple restaurants using React Query
 * Returns a record of restaurant IDs mapped to their image URLs
 */
export const useRestaurantImages = (restaurants: Restaurant[]) => {
  const queries = useQueries({
    queries: restaurants.map((restaurant) => ({
      queryKey: ["restaurantImage", restaurant.id],
      queryFn: () => fetchRestaurantImage(restaurant.id),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours - images don't change often
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      retry: 1, // Simple retry once since we handle all errors gracefully
      refetchOnWindowFocus: false,
    })),
  });

  // Transform results into a record of restaurantId -> imageUrl
  // Use useMemo to prevent object recreation on every render
  const restaurantImages = useMemo(() => {
    const images: Record<string, string> = {};
    queries.forEach((query, index) => {
      const restaurant = restaurants[index];
      if (query.data) {
        images[restaurant.id] = query.data;
      } else if (query.isError) {
        // Provide fallback for failed images
        images[restaurant.id] = "/photo-missing.webp";
      }
      // If still loading, don't add to the object yet
    });
    return images;
  }, [queries, restaurants]);

  const isLoading = queries.some((query) => query.isLoading);
  const hasErrors = queries.some((query) => query.isError);

  return {
    restaurantImages,
    isLoading,
    hasErrors,
    // Individual query states for debugging
    queries,
  };
};
