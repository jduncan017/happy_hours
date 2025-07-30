import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllRestaurants, createRestaurant } from '@/lib/supabase/restaurants';
import { NextResponse } from 'next/server';
import { RestaurantSchema } from '@/lib/schemas';

// GET /api/restaurants - Get all restaurants
export async function GET() {
  try {
    const supabase = await createClient();
    const restaurants = await getAllRestaurants(supabase);
    
    return NextResponse.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch restaurants',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// POST /api/restaurants - Create new restaurant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = RestaurantSchema.omit({ 
      id: true, 
      createdAt: true, 
      lastUpdated: true 
    }).safeParse(body);
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid restaurant data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }
    
    const supabase = createAdminClient();
    const restaurant = await createRestaurant(supabase, validationResult.data);
    
    if (!restaurant) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create restaurant' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: restaurant
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create restaurant',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}