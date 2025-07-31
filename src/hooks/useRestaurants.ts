import { useQuery } from '@tanstack/react-query';
import type { Restaurant } from '@/lib/types';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface RestaurantsResponse {
  success: boolean;
  data: Restaurant[];
  pagination?: PaginationInfo;
  error?: string;
}

async function fetchRestaurants(page?: number, limit?: number): Promise<RestaurantsResponse> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const url = `/api/restaurants${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  const result: RestaurantsResponse = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch restaurants');
  }
  
  return result;
}

export function useRestaurants(page?: number, limit?: number) {
  return useQuery({
    queryKey: ['restaurants', page, limit],
    queryFn: () => fetchRestaurants(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once on failure
  });
}

// For backward compatibility - fetch all restaurants without pagination
export function useAllRestaurants() {
  return useQuery({
    queryKey: ['restaurants', 'all'],
    queryFn: () => fetchRestaurants(1, 200), // Get all restaurants in one page
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1, // Only retry once on failure
    select: (data) => data.data, // Extract just the restaurant array
  });
}