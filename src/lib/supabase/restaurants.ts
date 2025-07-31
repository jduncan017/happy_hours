import { createClient as createServerClient } from "./server";
import { createClient as createBrowserClient } from "./client";
import type { Database } from "./database.types";
import type { Restaurant } from "../types";
import type { SupabaseClient as BaseSupabaseClient } from '@supabase/supabase-js';

type SupabaseClient = BaseSupabaseClient | Awaited<ReturnType<typeof createServerClient>>;

// Transform database row to our Restaurant type
function transformDatabaseRowToRestaurant(row: Database['public']['Tables']['restaurants']['Row']): Restaurant {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    coordinates: row.coordinates ? {
      lat: (row.coordinates as any).coordinates[1],  // GeoJSON format: [lng, lat]
      lng: (row.coordinates as any).coordinates[0]
    } : undefined,
    area: row.area || "",
    cuisineType: row.cuisine_type || "Unknown",
    priceCategory: row.price_category || "2",
    website: row.website || undefined,
    menuUrl: row.menu_url || undefined,
    heroImage: row.hero_image,
    images: row.images,
    happyHours: row.happy_hours as any, // Will validate with Zod later
    deals: [], // Will be populated from separate query
    notes: row.notes,
    ratings: {
      food: 0,
      drink: 0,
      service: 0,
      atmosphere: 0,
      price: 0,
      overall: 0,
      reviewCount: 0
    }, // Will be populated from separate query
    verified: row.verified,
    createdBy: row.created_by || "system",
    lastUpdated: new Date(row.updated_at),
    createdAt: new Date(row.created_at)
  };
}

// Get all restaurants with optional pagination
export async function getAllRestaurants(
  supabase: SupabaseClient, 
  limit?: number, 
  offset?: number
): Promise<Restaurant[]> {
  let query = supabase
    .from('restaurants')
    .select(`
      *,
      deals (*),
      restaurant_ratings (*)
    `)
    .order('name');

  if (limit !== undefined) {
    query = query.limit(limit);
  }
  
  if (offset !== undefined) {
    query = query.range(offset, offset + (limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  return data.map(row => {
    const restaurant = transformDatabaseRowToRestaurant(row);
    
    // Add deals if they exist
    if (row.deals && Array.isArray(row.deals)) {
      restaurant.deals = row.deals.map((deal: any) => ({
        description: deal.description,
        category: deal.category,
        daysApplied: deal.days_applied,
        timeRange: deal.time_start && deal.time_end ? {
          start: deal.time_start,
          end: deal.time_end
        } : undefined
      }));
    }

    // Add ratings if they exist
    if (row.restaurant_ratings && Array.isArray(row.restaurant_ratings) && row.restaurant_ratings.length > 0) {
      const ratings = row.restaurant_ratings[0];
      restaurant.ratings = {
        food: ratings.food_rating,
        drink: ratings.drink_rating,
        service: ratings.service_rating,
        atmosphere: ratings.atmosphere_rating,
        price: ratings.price_rating,
        overall: ratings.overall_rating,
        reviewCount: ratings.review_count
      };
    }

    return restaurant;
  });
}

// Get restaurants near a location
export async function getRestaurantsNearLocation(
  supabase: SupabaseClient,
  lat: number,
  lng: number,
  radiusMiles: number = 10
): Promise<Restaurant[]> {
  // Convert miles to meters for PostGIS
  const radiusMeters = radiusMiles * 1609.34;
  
  const { data, error } = await supabase
    .rpc('restaurants_within_radius', {
      center_lat: lat,
      center_lng: lng,
      radius_meters: radiusMeters
    });

  if (error) {
    console.error('Error fetching nearby restaurants:', error);
    return [];
  }

  return data?.map(transformDatabaseRowToRestaurant) || [];
}

// Create a new restaurant
export async function createRestaurant(
  supabase: SupabaseClient,
  restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'lastUpdated'>
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .insert({
      name: restaurant.name,
      address: restaurant.address,
      coordinates: restaurant.coordinates ? [restaurant.coordinates.lng, restaurant.coordinates.lat] : null,
      area: restaurant.area,
      cuisine_type: restaurant.cuisineType,
      price_category: restaurant.priceCategory,
      website: restaurant.website,
      menu_url: restaurant.menuUrl,
      hero_image: restaurant.heroImage,
      images: restaurant.images,
      happy_hours: restaurant.happyHours,
      notes: restaurant.notes,
      verified: restaurant.verified,
      created_by: restaurant.createdBy
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating restaurant:', error);
    return null;
  }

  return transformDatabaseRowToRestaurant(data);
}

// Update a restaurant
export async function updateRestaurant(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Restaurant>
): Promise<Restaurant | null> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.coordinates !== undefined) {
    updateData.coordinates = updates.coordinates ? [updates.coordinates.lng, updates.coordinates.lat] : null;
  }
  if (updates.area !== undefined) updateData.area = updates.area;
  if (updates.cuisineType !== undefined) updateData.cuisine_type = updates.cuisineType;
  if (updates.priceCategory !== undefined) updateData.price_category = updates.priceCategory;
  if (updates.website !== undefined) updateData.website = updates.website;
  if (updates.menuUrl !== undefined) updateData.menu_url = updates.menuUrl;
  if (updates.heroImage !== undefined) updateData.hero_image = updates.heroImage;
  if (updates.images !== undefined) updateData.images = updates.images;
  if (updates.happyHours !== undefined) updateData.happy_hours = updates.happyHours;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.verified !== undefined) updateData.verified = updates.verified;

  const { data, error } = await supabase
    .from('restaurants')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating restaurant:', error);
    return null;
  }

  return transformDatabaseRowToRestaurant(data);
}