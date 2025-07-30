#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';
import { HAPPY_HOURS } from '../src/lib/hh_list';
import { transformLegacyRestaurantToEnhanced, inferCuisineFromName, inferPriceCategoryFromArea } from '../src/lib/data-transform';

// Load environment variables
config({ path: '.env.local' });

async function testMigration() {
  console.log('🧪 Testing data migration (without geocoding)...');
  
  const supabase = createAdminClient();
  
  // Get first 3 restaurants for testing
  const testRestaurants = HAPPY_HOURS.CO.Denver.slice(0, 3);
  console.log(`📊 Testing with ${testRestaurants.length} restaurants`);
  
  for (let i = 0; i < testRestaurants.length; i++) {
    const legacyRestaurant = testRestaurants[i];
    
    try {
      console.log(`\n🔄 Processing: ${legacyRestaurant.name}`);
      console.log(`   Address: ${legacyRestaurant.address}`);
      console.log(`   Area: ${legacyRestaurant.area}`);
      
      // Transform legacy restaurant
      const enhancedRestaurant = transformLegacyRestaurantToEnhanced(legacyRestaurant, {
        cuisineType: inferCuisineFromName(legacyRestaurant.name),
        priceCategory: inferPriceCategoryFromArea(legacyRestaurant.area),
      });
      
      console.log(`   Inferred cuisine: ${enhancedRestaurant.cuisineType}`);
      console.log(`   Inferred price: ${'$'.repeat(parseInt(enhancedRestaurant.priceCategory))}`);
      
      // Insert into database
      const { data, error } = await supabase
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
      
      if (error) {
        console.log(`❌ Failed: ${error.message}`);
      } else {
        console.log(`✅ Success! ID: ${data.id}`);
        
        // Create default ratings
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
      }
      
    } catch (error) {
      console.log(`❌ Error: ${(error as Error).message}`);
    }
  }
  
  // Check results
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (!error && restaurants) {
    console.log(`\n✅ Database now has ${restaurants.length} recent restaurants:`);
    restaurants.forEach(r => {
      console.log(`   • ${r.name} (${r.cuisine_type}, ${r.price_category})`);
    });
  }
  
  console.log('\n🎉 Test migration complete!');
}

testMigration().catch(console.error);