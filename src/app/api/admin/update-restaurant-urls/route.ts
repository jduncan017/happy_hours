/**
 * API Route for updating restaurant URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateRestaurantUrls } from '@/lib/supabase/urlValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, websiteUrl, menuUrl } = body;
    
    console.log('🔧 Update restaurant URLs API called with:', {
      restaurantId,
      websiteUrl,
      menuUrl
    });
    
    if (!restaurantId) {
      return NextResponse.json({
        success: false,
        error: 'Restaurant ID is required'
      }, { status: 400 });
    }
    
    const success = await updateRestaurantUrls(
      restaurantId,
      websiteUrl,
      menuUrl
    );
    
    console.log('🔧 Update result:', success);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'URLs updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to update URLs'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Update restaurant URLs API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}