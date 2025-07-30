// Geocoding utilities for restaurant addresses

export interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address: string;
  accuracy: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE';
}

// Enhance incomplete addresses with Denver context
export function enhanceAddress(address: string): string {
  const trimmed = address.trim();
  
  // If address already has city/state, return as-is
  if (trimmed.includes('Denver') || trimmed.includes('CO')) {
    return trimmed;
  }
  
  // Add Denver, CO context for incomplete addresses
  return `${trimmed}, Denver, CO`;
}

// Geocode address using Google Geocoding API
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }
  
  try {
    const enhancedAddress = enhanceAddress(address);
    const encodedAddress = encodeURIComponent(enhancedAddress);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn(`Geocoding failed for address: ${address}`, data.status);
      return null;
    }
    
    const result = data.results[0];
    const location = result.geometry.location;
    
    return {
      lat: location.lat,
      lng: location.lng,
      formatted_address: result.formatted_address,
      accuracy: result.geometry.location_type
    };
    
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Batch geocode multiple addresses with rate limiting
export async function batchGeocode(
  addresses: { id: string; address: string; name: string }[],
  onProgress?: (completed: number, total: number, current: string) => void
): Promise<Map<string, GeocodeResult>> {
  const results = new Map<string, GeocodeResult>();
  
  for (let i = 0; i < addresses.length; i++) {
    const { id, address, name } = addresses[i];
    
    onProgress?.(i, addresses.length, name);
    
    const result = await geocodeAddress(address);
    if (result) {
      results.set(id, result);
    }
    
    // Rate limiting: Wait 100ms between requests to avoid hitting API limits
    if (i < addresses.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  onProgress?.(addresses.length, addresses.length, 'Complete');
  return results;
}