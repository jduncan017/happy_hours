import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { fetchOgImage } from '@/utils/fetchOgImage';

// GET /api/restaurants/[id]/image - Fetch and store restaurant OG image
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // First get the restaurant to check if it already has a heroImage and get the website
    const { data: restaurant, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, website, heroImage')
      .eq('id', params.id)
      .single();

    if (fetchError || !restaurant) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Restaurant not found' 
        },
        { status: 404 }
      );
    }

    // If restaurant already has a heroImage, return it
    if (restaurant.heroImage && restaurant.heroImage.trim() !== '') {
      return NextResponse.json({
        success: true,
        data: { imageUrl: restaurant.heroImage, cached: true }
      });
    }

    // If no website, return error
    if (!restaurant.website) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Restaurant has no website to fetch image from' 
        },
        { status: 400 }
      );
    }

    // Fetch OG image from website
    let ogImageUrl: string;
    try {
      ogImageUrl = await fetchOgImage(restaurant.website);
    } catch (error) {
      console.error('Error fetching OG image:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch image from website',
          details: (error as Error).message
        },
        { status: 400 }
      );
    }

    // If fetchOgImage returned "Image Not Found", don't store it
    if (ogImageUrl === "Image Not Found") {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No image found on website' 
        },
        { status: 404 }
      );
    }

    // Update restaurant with the fetched image URL
    const { data: updatedRestaurant, error: updateError } = await supabase
      .from('restaurants')
      .update({ 
        heroImage: ogImageUrl,
        lastUpdated: new Date().toISOString()
      })
      .eq('id', params.id)
      .select('heroImage')
      .single();

    if (updateError) {
      console.error('Error updating restaurant heroImage:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save image to database',
          details: updateError.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { imageUrl: updatedRestaurant.heroImage, cached: false }
    });
    
  } catch (error) {
    console.error('Error in restaurant image endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}