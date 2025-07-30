#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';
import { HAPPY_HOURS } from '../src/lib/hh_list';
import { batchGeocode } from '../src/lib/geocoding';

// Load environment variables
config({ path: '.env.local' });

async function updateAllCoordinates() {
  console.log('🚀 Updating all restaurant coordinates...');
  
  const supabase = createAdminClient();
  const legacyRestaurants = HAPPY_HOURS.CO.Denver;
  
  console.log(`📊 Found ${legacyRestaurants.length} restaurants to update`);
  
  // Step 1: Geocode all addresses (we'll get cached results)
  console.log('🗺️  Step 1: Geocoding addresses...');
  
  const addressesToGeocode = legacyRestaurants.map((restaurant, index) => ({
    id: `legacy-${index}`,
    address: restaurant.address,
    name: restaurant.name
  }));
  
  const geocodeResults = await batchGeocode(
    addressesToGeocode,
    (completed, total, current) => {
      process.stdout.write(`\r   Progress: ${completed}/${total} - ${current}`);
    }
  );
  
  console.log(`\n✅ Geocoded ${geocodeResults.size}/${legacyRestaurants.length} addresses`);
  
  // Step 2: Get all restaurants from database
  console.log('\n🔍 Step 2: Fetching restaurants from database...');
  
  const { data: restaurants, error: fetchError } = await supabase
    .from('restaurants')
    .select('id, name, address, coordinates');
  
  if (fetchError) {
    console.error('❌ Error fetching restaurants:', fetchError);
    return;
  }
  
  console.log(`📄 Found ${restaurants?.length || 0} restaurants in database`);
  
  // Step 3: Update coordinates for restaurants
  console.log('\n📍 Step 3: Updating coordinates...');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const restaurant of restaurants || []) {
    // Find matching legacy restaurant by name
    const legacyIndex = legacyRestaurants.findIndex(
      legacy => legacy.name.toLowerCase() === restaurant.name.toLowerCase()
    );
    
    if (legacyIndex === -1) {
      console.log(`⚠️  No match found for: ${restaurant.name}`);
      skipped++;
      continue;
    }
    
    // Get geocoded coordinates
    const geocodeResult = geocodeResults.get(`legacy-${legacyIndex}`);
    
    if (!geocodeResult) {
      console.log(`⚠️  No coordinates for: ${restaurant.name}`);
      skipped++;
      continue;
    }
    
    // Update coordinates
    const { error: updateError } = await supabase.rpc('update_restaurant_coordinates', {
      restaurant_id: restaurant.id,
      lng: geocodeResult.lng,
      lat: geocodeResult.lat
    });
    
    if (updateError) {
      console.error(`❌ Error updating ${restaurant.name}:`, updateError.message);
      errors++;
    } else {
      console.log(`✅ Updated: ${restaurant.name}`);
      updated++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📈 COORDINATE UPDATE COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} restaurants`);
  console.log(`⚠️  Skipped: ${skipped} restaurants`);
  console.log(`❌ Errors: ${errors} restaurants`);
}

updateAllCoordinates().catch(console.error);