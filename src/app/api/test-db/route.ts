import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test 1: Basic connection
    console.log('Testing Supabase connection...');
    
    // Test 2: Try to list tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names');
    
    if (tablesError) {
      console.log('Table listing error:', tablesError);
    }
    
    // Test 3: Try restaurants table
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        errorCode: error.code,
        errorDetails: error.details,
        message: 'Database connection failed',
        tables: tables || 'Could not fetch tables'
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
      restaurantCount: data?.length || 0,
      tables: tables || 'Tables query not available'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message,
      message: 'Failed to connect to database'
    });
  }
}