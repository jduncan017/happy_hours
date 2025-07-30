import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

// POST /api/restaurants/test - Create a test restaurant directly
export async function POST() {
  try {
    const supabase = createAdminClient();
    
    // Create a simple test restaurant directly in the database
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name: 'Test Restaurant',
        address: '123 Test St, Denver, CO 80202',
        area: 'Downtown',
        cuisine_type: 'American',
        price_category: '2',
        website: 'https://testrestaurant.com',
        hero_image: '/photo-missing.webp',
        images: [],
        happy_hours: {
          "Mon": [{"Start": "15:00", "End": "18:00"}]
        },
        notes: ['Test restaurant for API testing'],
        verified: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test restaurant created successfully!',
      data
    });

  } catch (error) {
    console.error('Error creating test restaurant:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}