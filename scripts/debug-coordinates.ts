#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';

// Load environment variables
config({ path: '.env.local' });

async function debugCoordinates() {
  console.log('🔍 Debugging coordinate format...');
  
  const supabase = createAdminClient();
  
  // Get raw coordinate data
  const { data: raw, error } = await supabase
    .from('restaurants')
    .select('id, name, coordinates')
    .limit(3);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📊 Raw coordinate data:');
  raw?.forEach(restaurant => {
    console.log(`${restaurant.name}:`);
    console.log(`  Type: ${typeof restaurant.coordinates}`);
    console.log(`  Value: ${JSON.stringify(restaurant.coordinates, null, 2)}`);
    console.log(`  Keys: ${restaurant.coordinates ? Object.keys(restaurant.coordinates) : 'None'}`);
    console.log('---');
  });
  
  // Try to get coordinates as text
  const { data: textCoords, error: textError } = await supabase
    .rpc('get_coordinates_as_text', {});
  
  if (textError) {
    console.log('⚠️  get_coordinates_as_text function not available');
  } else {
    console.log('📝 Text coordinates:', textCoords);
  }
}

debugCoordinates().catch(console.error);