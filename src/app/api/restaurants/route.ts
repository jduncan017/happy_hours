import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllRestaurants, createRestaurant } from '@/lib/supabase/restaurants';
import { NextResponse } from 'next/server';
import { RestaurantSchema } from '@/lib/schemas';

// GET /api/restaurants - Get all restaurants with pagination support
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    
    // Get total count
    const { count } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true });
    
    // Get paginated restaurants
    const restaurants = await getAllRestaurants(supabase, limit, offset);
    
    const totalPages = Math.ceil((count || 0) / limit);
    
    return NextResponse.json({
      success: true,
      data: restaurants,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
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
      console.log('Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid restaurant data',
          details: validationResult.error.issues
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