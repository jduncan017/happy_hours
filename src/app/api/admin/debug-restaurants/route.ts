/**
 * Debug API Route to check restaurant data
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get count of restaurants
    const { count: totalCount, error: countError } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting restaurants:', countError);
    }
    
    // Get first few restaurants with their IDs
    const { data: sampleRestaurants, error: sampleError } = await supabase
      .from('restaurants')
      .select('id, name, website, menu_url')
      .limit(5)
      .order('name');
    
    if (sampleError) {
      console.error('Error fetching sample restaurants:', sampleError);
    }
    
    return NextResponse.json({
      success: true,
      totalCount: totalCount || 0,
      sampleRestaurants: sampleRestaurants || [],
      errors: {
        countError,
        sampleError
      }
    });
    
  } catch (error) {
    console.error('Debug restaurants API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}