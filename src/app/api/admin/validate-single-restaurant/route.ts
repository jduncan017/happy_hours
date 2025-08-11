/**
 * API Route for validating a single restaurant with custom URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRestaurantUrls } from '@/utils/validation/urlValidator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, website, menuUrl } = body;
    
    console.log('🔍 Single restaurant validation API called with:', { 
      restaurantId, 
      website, 
      menuUrl 
    });
    
    if (!restaurantId) {
      return NextResponse.json({
        success: false,
        error: 'Restaurant ID is required'
      }, { status: 400 });
    }
    
    // Create a restaurant object for validation
    const restaurantForValidation = {
      id: restaurantId,
      name: `Restaurant ${restaurantId}`, // Name is just for logging
      website: website,
      menuUrl: menuUrl
    };
    
    // Validate the URLs
    const validationResult = await validateRestaurantUrls(restaurantForValidation);
    
    console.log('🔍 Validation result:', {
      restaurantId,
      website: validationResult.website ? {
        url: validationResult.website.url,
        isValid: validationResult.website.isValid,
        statusCode: validationResult.website.statusCode
      } : null,
      menuUrl: validationResult.menuUrl ? {
        url: validationResult.menuUrl.url,
        isValid: validationResult.menuUrl.isValid,
        statusCode: validationResult.menuUrl.statusCode
      } : null
    });
    
    return NextResponse.json({
      success: true,
      result: validationResult
    });
    
  } catch (error) {
    console.error('Single restaurant validation API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}