import { createClient } from '@/lib/supabase/server';
import { updateRestaurant } from '@/lib/supabase/restaurants';
import { NextResponse } from 'next/server';
import { RestaurantSchema } from '@/lib/schemas';

// GET /api/restaurants/[id] - Get single restaurant
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        deals (*),
        restaurant_ratings (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Restaurant not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch restaurant',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// PUT /api/restaurants/[id] - Update restaurant
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Validate request body (partial update allowed)
    const validationResult = RestaurantSchema.partial().safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid restaurant data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    const restaurant = await updateRestaurant(supabase, id, validationResult.data);
    
    if (!restaurant) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update restaurant or restaurant not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: restaurant
    });
    
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update restaurant',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurants/[id] - Delete restaurant
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete restaurant',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete restaurant',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}