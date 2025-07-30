#!/usr/bin/env tsx

import { config } from 'dotenv';
import { geocodeAddress } from '../src/lib/geocoding';

// Load environment variables
config({ path: '.env.local' });

async function testGeocode() {
  console.log('🧪 Testing geocoding...');
  
  const testAddresses = [
    "215 E 7th Ave",
    "2556 15th St. Denver, CO 80211",
    "1616 16th St"
  ];
  
  for (const address of testAddresses) {
    console.log(`\n📍 Testing: ${address}`);
    
    const result = await geocodeAddress(address);
    
    if (result) {
      console.log('✅ Success!');
      console.log(`   Coordinates: ${result.lat}, ${result.lng}`);
      console.log(`   Formatted: ${result.formatted_address}`);
      console.log(`   Accuracy: ${result.accuracy}`);
    } else {
      console.log('❌ Failed');
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

testGeocode().catch(console.error);