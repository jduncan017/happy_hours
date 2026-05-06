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
 * Hook to fetch a single restaurant's image.
 * Skips the network call when the restaurant already has a stored heroImage.
 */
export const useRestaurantImage = (
  restaurantId: string,
  heroImage?: string | null,
) => {
  const hasStored = !!(heroImage && heroImage.trim() !== "");
  return useQuery({
    queryKey: ["restaurantImage", restaurantId],
    queryFn: () => fetchRestaurantImage(restaurantId),
    initialData: hasStored ? heroImage! : undefined,
    enabled: !hasStored,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Pre-load images for multiple restaurants. Restaurants with a stored
 * heroImage skip the API entirely; only those missing one trigger fetches.
 */
export const useRestaurantImages = (restaurants: Restaurant[]) => {
  const queries = useQueries({
    queries: restaurants.map((restaurant) => {
      const hasStored = !!(
        restaurant.heroImage && restaurant.heroImage.trim() !== ""
      );
      return {
        queryKey: ["restaurantImage", restaurant.id],
        queryFn: () => fetchRestaurantImage(restaurant.id),
        initialData: hasStored ? restaurant.heroImage! : undefined,
        enabled: !hasStored,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24 * 7,
        retry: 1,
        refetchOnWindowFocus: false,
      };
    }),
  });

  // Build the URL map. useMemo deps include only the data signature so
  // we don't churn on unrelated query-state changes.
  const dataSignature = queries.map((q) => q.data ?? null).join("|");
  const errorSignature = queries.map((q) => (q.isError ? "1" : "0")).join("");

  const restaurantImages = useMemo(() => {
    const images: Record<string, string> = {};
    queries.forEach((query, index) => {
      const restaurant = restaurants[index];
      if (query.data) {
        images[restaurant.id] = query.data;
      } else if (query.isError) {
        images[restaurant.id] = "/photo-missing.webp";
      }
    });
    return images;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSignature, errorSignature, restaurants]);

  const isLoading = queries.some((query) => query.isLoading);
  const hasErrors = queries.some((query) => query.isError);

  return {
    restaurantImages,
    isLoading,
    hasErrors,
    queries,
  };
};
