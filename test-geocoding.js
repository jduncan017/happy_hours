// Quick test of geocoding functionality
import { geocodeAddress } from './src/lib/geocoding.ts';

async function testGeocode() {
  console.log('🧪 Testing geocoding...');
  
  const testAddress = "215 E 7th Ave";
  console.log(`📍 Testing address: ${testAddress}`);
  
  const result = await geocodeAddress(testAddress);
  
  if (result) {
    console.log('✅ Geocoding successful!');
    console.log(`   Coordinates: ${result.lat}, ${result.lng}`);
    console.log(`   Formatted: ${result.formatted_address}`);
    console.log(`   Accuracy: ${result.accuracy}`);
  } else {
    console.log('❌ Geocoding failed');
  }
}

testGeocode();