/**
 * API Route for URL validation
 * Runs server-side to avoid CORS and browser security issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAllRestaurantUrls } from '@/lib/supabase/urlValidation';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (you might want to add proper auth check here)
    // For now, we'll trust that the admin dashboard is protected
    
    const results = await validateAllRestaurantUrls();
    
    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalRestaurants: results.length,
        brokenUrls: results.filter(r => 
          (r.website && !r.website.isValid) || 
          (r.menuUrl && !r.menuUrl.isValid)
        ).length
      }
    });
    
  } catch (error) {
    console.error('URL validation API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

// Also support GET for testing
export async function GET() {
  return POST(new NextRequest('http://localhost:3000/api/admin/validate-urls', { method: 'POST' }));
}