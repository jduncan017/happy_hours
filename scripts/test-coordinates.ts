#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';

// Load environment variables
config({ path: '.env.local' });

async function testCoordinates() {
  console.log('🧪 Testing coordinate storage...');
  
  const supabase = createAdminClient();
  
  // Get a restaurant
  const { data: restaurants, error: fetchError } = await supabase
    .from('restaurants')
    .select('id, name, coordinates')
    .limit(3);
  
  if (fetchError) {
    console.error('❌ Error fetching restaurants:', fetchError);
    return;
  }
  
  console.log('📊 Sample restaurants:');
  restaurants?.forEach(restaurant => {
    console.log(`  ${restaurant.name}: ${restaurant.coordinates}`);
  });
  
  // Test coordinate update function
  if (restaurants && restaurants.length > 0) {
    console.log('\n🔧 Testing coordinate update...');
    const testRestaurant = restaurants[0];
    
    const { error: updateError } = await supabase.rpc('update_restaurant_coordinates', {
      restaurant_id: testRestaurant.id,
      lng: -104.9845678,
      lat: 39.7274579
    });
    
    if (updateError) {
      console.error('❌ Update error:', updateError);
    } else {
      console.log('✅ Update successful');
    }
    
    // Check if it worked
    const { data: updated, error: checkError } = await supabase
      .from('restaurants')
      .select('id, name, coordinates')
      .eq('id', testRestaurant.id)
      .single();
    
    if (checkError) {
      console.error('❌ Check error:', checkError);
    } else {
      console.log(`Updated restaurant coordinates: ${updated?.coordinates}`);
    }
  }
}

testCoordinates().catch(console.error);