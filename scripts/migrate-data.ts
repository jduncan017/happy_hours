#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';
import { HAPPY_HOURS } from '../src/lib/hh_list';
import { geocodeAddress, batchGeocode } from '../src/lib/geocoding';
import { transformLegacyRestaurantToEnhanced, inferCuisineFromName, inferPriceCategoryFromArea } from '../src/lib/data-transform';
import type { LegacyRestaurant } from '../src/lib/types';

// Load environment variables
config({ path: '.env.local' });

interface MigrationProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  errors: string[];
}

async function migrateRestaurantData() {
  console.log('🚀 Starting restaurant data migration...');
  
  const supabase = createAdminClient();
  const progress: MigrationProgress = {
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };
  
  // Get all legacy restaurants
  const legacyRestaurants = HAPPY_HOURS.CO.Denver;
  progress.total = legacyRestaurants.length;
  
  console.log(`📊 Found ${progress.total} restaurants to migrate`);
  
  // Step 1: Prepare addresses for geocoding
  console.log('\n🌍 Step 1: Preparing addresses for geocoding...');
  
  const addressesToGeocode = legacyRestaurants.map((restaurant, index) => ({
    id: `legacy-${index}`,
    address: restaurant.address,
    name: restaurant.name
  }));
  
  // Step 2: Batch geocode all addresses
  console.log('\n🗺️  Step 2: Geocoding addresses...');
  
  const geocodeResults = await batchGeocode(
    addressesToGeocode,
    (completed, total, current) => {
      process.stdout.write(`\r   Progress: ${completed}/${total} - ${current}`);
    }
  );
  
  console.log(`\n✅ Geocoded ${geocodeResults.size}/${progress.total} addresses successfully`);
  
  // Step 3: Transform and insert restaurants
  console.log('\n💾 Step 3: Inserting restaurants into database...');
  
  for (let i = 0; i < legacyRestaurants.length; i++) {
    const legacyRestaurant = legacyRestaurants[i];
    const addressId = `legacy-${i}`;
    
    try {
      // Get geocoding result
      const geocodeResult = geocodeResults.get(addressId);
      
      // Transform legacy restaurant to enhanced format
      const enhancedRestaurant = transformLegacyRestaurantToEnhanced(legacyRestaurant, {
        coordinates: geocodeResult ? {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng
        } : undefined,
        cuisineType: inferCuisineFromName(legacyRestaurant.name),
        priceCategory: inferPriceCategoryFromArea(legacyRestaurant.area),
        // Update address to use geocoded formatted address if available
        address: geocodeResult?.formatted_address || legacyRestaurant.address
      });
      
      // Insert into database using raw SQL for PostGIS
      let insertData: any = {
        name: enhancedRestaurant.name,
        address: enhancedRestaurant.address,
        area: enhancedRestaurant.area,
        cuisine_type: enhancedRestaurant.cuisineType,
        price_category: enhancedRestaurant.priceCategory,
        website: enhancedRestaurant.website,
        hero_image: enhancedRestaurant.heroImage,
        images: enhancedRestaurant.images,
        happy_hours: enhancedRestaurant.happyHours,
        notes: enhancedRestaurant.notes,
        verified: enhancedRestaurant.verified
      };

      let data, error;

      // Insert without coordinates first, then update with coordinates if available
      const { data: insertResult, error: insertError } = await supabase
        .from('restaurants')
        .insert({
          name: enhancedRestaurant.name,
          address: enhancedRestaurant.address,
          area: enhancedRestaurant.area,
          cuisine_type: enhancedRestaurant.cuisineType,
          price_category: enhancedRestaurant.priceCategory,
          website: enhancedRestaurant.website,
          hero_image: enhancedRestaurant.heroImage,
          images: enhancedRestaurant.images,
          happy_hours: enhancedRestaurant.happyHours,
          notes: enhancedRestaurant.notes,
          verified: enhancedRestaurant.verified
        })
        .select()
        .single();
      
      if (!insertError && insertResult && enhancedRestaurant.coordinates) {
        // Update with coordinates using raw SQL
        await supabase.rpc('update_restaurant_coordinates', {
          restaurant_id: insertResult.id,
          lng: enhancedRestaurant.coordinates.lng,
          lat: enhancedRestaurant.coordinates.lat
        });
      }
      
      data = insertResult;
      error = insertError;
      
      if (error) {
        progress.failed++;
        progress.errors.push(`${legacyRestaurant.name}: ${error.message}`);
        console.log(`\n❌ Failed to insert ${legacyRestaurant.name}: ${error.message}`);
      } else {
        progress.successful++;
        
        // Create default ratings entry
        await supabase
          .from('restaurant_ratings')
          .insert({
            restaurant_id: data.id,
            food_rating: 0,
            drink_rating: 0,
            service_rating: 0,
            atmosphere_rating: 0,
            price_rating: 0,
            overall_rating: 0,
            review_count: 0
          });
        
        const geocodeStatus = geocodeResult ? '🌍' : '📍';
        console.log(`\n✅ ${geocodeStatus} Migrated: ${legacyRestaurant.name}`);
      }
      
      progress.processed++;
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      progress.failed++;
      progress.errors.push(`${legacyRestaurant.name}: ${(error as Error).message}`);
      console.log(`\n❌ Error migrating ${legacyRestaurant.name}:`, error);
    }
  }
  
  // Step 4: Report results
  console.log('\n' + '='.repeat(60));
  console.log('📈 MIGRATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${progress.successful}/${progress.total} restaurants`);
  console.log(`🌍 Geocoded addresses: ${geocodeResults.size}/${progress.total}`);
  console.log(`❌ Failed migrations: ${progress.failed}`);
  
  if (progress.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    progress.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  // Test the migration
  console.log('\n🔍 Testing migration...');
  const { data: restaurantCount, error: countError } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true });
  
  if (!countError) {
    console.log(`✅ Database now contains ${restaurantCount?.length || 0} restaurants`);
  }
  
  console.log('\n🎉 Migration complete! You can now:');
  console.log('   1. View restaurants at http://localhost:3000/api/restaurants');
  console.log('   2. Test location-based queries');
  console.log('   3. Start using the enhanced features');
}

// Run migration
migrateRestaurantData().catch(console.error);