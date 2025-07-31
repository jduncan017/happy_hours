#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createAdminClient } from '../src/lib/supabase/admin';

// Load environment variables
config({ path: '.env.local' });

async function cleanDuplicateRestaurants() {
  const supabase = createAdminClient();

  console.log('🔍 Finding duplicate restaurants...');

  // Get all restaurants
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching restaurants:', error);
    return;
  }

  // Group by name to find duplicates
  const restaurantGroups = restaurants.reduce((groups: Record<string, any[]>, restaurant) => {
    const key = restaurant.name.toLowerCase().trim();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(restaurant);
    return groups;
  }, {});

  const duplicateGroups = Object.entries(restaurantGroups).filter(([_, restaurants]) => restaurants.length > 1);

  console.log(`Found ${duplicateGroups.length} restaurant names with duplicates:`);

  for (const [name, duplicates] of duplicateGroups) {
    console.log(`\n📍 ${duplicates[0].name} (${duplicates.length} entries):`);
    
    // Keep the first one (usually the most complete)
    const keepRestaurant = duplicates[0];
    const removeRestaurants = duplicates.slice(1);

    console.log(`  ✅ Keeping: ${keepRestaurant.id} - ${keepRestaurant.address}`);
    
    for (const restaurant of removeRestaurants) {
      console.log(`  🗑️  Removing: ${restaurant.id} - ${restaurant.address}`);
      
      const { error: deleteError } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurant.id);

      if (deleteError) {
        console.error(`    ❌ Error deleting ${restaurant.id}:`, deleteError);
      } else {
        console.log(`    ✅ Deleted successfully`);
      }
    }
  }

  // Final count
  const { count } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎉 Cleanup complete! ${count} restaurants remaining.`);
}

cleanDuplicateRestaurants().catch(console.error);