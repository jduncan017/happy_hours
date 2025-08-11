/**
 * API Route for deleting restaurants
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId } = body;
    
    console.log('🗑️ Delete restaurant API called with:', { restaurantId });
    
    if (!restaurantId) {
      return NextResponse.json({
        success: false,
        error: 'Restaurant ID is required'
      }, { status: 400 });
    }
    
    // Use service role client for admin operations to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { error, data } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId)
      .select(); // Add select to see what was deleted
    
    console.log('🗑️ Database delete result:', { error, data });
    
    if (error) {
      console.error('Error deleting restaurant:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete restaurant API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}