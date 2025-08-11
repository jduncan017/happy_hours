/**
 * Database functions for URL validation
 */

import { createClient } from './server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { 
  validateRestaurantUrls, 
  type RestaurantUrlValidation,
  getValidationSummary
} from '@/utils/validation/urlValidator';

// Re-export types for convenience
export type { RestaurantUrlValidation } from '@/utils/validation/urlValidator';

export interface RestaurantForValidation {
  id: string;
  name: string;
  website?: string | null;
  menu_url?: string | null;
}

/**
 * Fetches all restaurants from the database for URL validation
 * @returns Promise<RestaurantForValidation[]>
 */
export async function getRestaurantsForValidation(): Promise<RestaurantForValidation[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, website, menu_url')
    .order('name');

  if (error) {
    console.error('Error fetching restaurants for validation:', error);
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }

  console.log('🔧 Fetched restaurants for validation:', {
    count: data?.length || 0,
    sampleIds: data?.slice(0, 3).map(r => ({ id: r.id, name: r.name })) || []
  });

  return data || [];
}

/**
 * Validates URLs for all restaurants in the database
 * @param onProgress - Optional callback to report progress (restaurantIndex, totalRestaurants)
 * @returns Promise<RestaurantUrlValidation[]>
 */
export async function validateAllRestaurantUrls(
  onProgress?: (current: number, total: number, restaurantName: string) => void
): Promise<RestaurantUrlValidation[]> {
  console.log('Starting URL validation for all restaurants...');
  
  const restaurants = await getRestaurantsForValidation();
  const results: RestaurantUrlValidation[] = [];
  
  console.log(`Found ${restaurants.length} restaurants to validate`);
  
  // Process restaurants one by one to provide progress updates
  // and avoid overwhelming servers with concurrent requests
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, restaurants.length, restaurant.name);
    }
    
    try {
      // Convert snake_case to camelCase for the validation function
      const restaurantForValidation = {
        id: restaurant.id,
        name: restaurant.name,
        website: restaurant.website,
        menuUrl: restaurant.menu_url
      };
      const validation = await validateRestaurantUrls(restaurantForValidation);
      results.push(validation);
      
      // Log ALL results for debugging
      console.log(`✓ Validated ${restaurant.name}:`);
      if (validation.website) {
        const status = validation.website.isValid ? '✅' : '❌';
        console.log(`  ${status} Website: ${validation.website.url} (${validation.website.statusCode || validation.website.error})`);
      }
      if (validation.menuUrl) {
        const status = validation.menuUrl.isValid ? '✅' : '❌';
        console.log(`  ${status} Menu: ${validation.menuUrl.url} (${validation.menuUrl.statusCode || validation.menuUrl.error})`);
      }
    } catch (error) {
      console.error(`❌ Failed to validate URLs for ${restaurant.name}:`, error);
      // Still add a result with error state
      results.push({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        website: restaurant.website ? {
          url: restaurant.website,
          isValid: false,
          error: 'Validation failed'
        } : null,
        menuUrl: restaurant.menu_url ? {
          url: restaurant.menu_url,
          isValid: false,
          error: 'Validation failed'
        } : null,
        hasValidUrls: false,
      });
    }
    
    // Longer delay between requests to be respectful to servers and improve success rate
    if (i < restaurants.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Log summary
  const summary = getValidationSummary(results);
  console.log('URL Validation Summary:', summary);
  
  return results;
}

/**
 * Validates URLs for a specific restaurant by ID
 * @param restaurantId - The restaurant ID to validate
 * @returns Promise<RestaurantUrlValidation | null>
 */
export async function validateRestaurantUrlsById(
  restaurantId: string
): Promise<RestaurantUrlValidation | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, website, menu_url')
    .eq('id', restaurantId)
    .single();

  if (error) {
    console.error('Error fetching restaurant for validation:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Convert snake_case to camelCase for the validation function
  const restaurantForValidation = {
    id: data.id,
    name: data.name,
    website: data.website,
    menuUrl: data.menu_url
  };
  return await validateRestaurantUrls(restaurantForValidation);
}

/**
 * Gets restaurants with broken URLs only
 * @returns Promise<RestaurantUrlValidation[]>
 */
export async function getRestaurantsWithBrokenUrls(): Promise<RestaurantUrlValidation[]> {
  const allResults = await validateAllRestaurantUrls();
  
  return allResults.filter(result => {
    const hasBrokenWebsite = result.website && !result.website.isValid;
    const hasBrokenMenuUrl = result.menuUrl && !result.menuUrl.isValid;
    return hasBrokenWebsite || hasBrokenMenuUrl;
  });
}

/**
 * Updates a restaurant's website URL in the database
 * @param restaurantId - The restaurant ID
 * @param websiteUrl - New website URL (null to remove)
 * @param menuUrl - New menu URL (null to remove)  
 * @returns Promise<boolean> - Success status
 */
export async function updateRestaurantUrls(
  restaurantId: string,
  websiteUrl?: string | null,
  menuUrl?: string | null
): Promise<boolean> {
  // Use service role client for admin operations to bypass RLS
  console.log('🔧 Using service role client:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...'
  });
  
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  // Only build updates object with fields that were actually provided
  const updates: { website?: string | null; menu_url?: string | null } = {};
  
  if (websiteUrl !== undefined) {
    updates.website = websiteUrl;
  }
  
  if (menuUrl !== undefined) {
    updates.menu_url = menuUrl;
  }
  
  // If no updates to make, return success
  if (Object.keys(updates).length === 0) {
    console.log('🔧 No updates to make for restaurant:', restaurantId);
    return true;
  }
  
  console.log('🔧 Updating restaurant URLs:', {
    restaurantId,
    updates,
    originalParams: { websiteUrl, menuUrl }
  });
  
  // Check current user context and permissions
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('🔧 Current user context:', { 
    userId: user?.id, 
    userRole: user?.user_metadata?.role,
    userError 
  });
  
  // First, let's check if the restaurant exists
  const { data: existingRestaurant, error: checkError } = await supabase
    .from('restaurants')
    .select('id, name, website, menu_url')
    .eq('id', restaurantId)
    .single();
  
  console.log('🔧 Restaurant exists check:', { 
    restaurantId, 
    exists: !!existingRestaurant, 
    existingRestaurant, 
    checkError 
  });
  
  if (checkError || !existingRestaurant) {
    console.error('🔧 Restaurant not found:', restaurantId, checkError);
    return false;
  }
  
  const { error, data } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', restaurantId)
    .select(); // Remove single() to avoid the error
  
  console.log('🔧 Database update result:', { 
    error, 
    data, 
    updatesApplied: updates,
    rowsAffected: data?.length || 0
  });

  if (error) {
    console.error('Error updating restaurant URLs:', error);
    return false;
  }

  // Check if any rows were actually updated
  if (!data || data.length === 0) {
    console.error('🔧 No rows were updated - restaurant may not exist:', restaurantId);
    return false;
  }

  // Log the updated restaurant to verify the changes
  console.log('🔧 Restaurant successfully updated:', {
    restaurantId,
    updatedData: data[0],
    changes: updates
  });

  return true;
}