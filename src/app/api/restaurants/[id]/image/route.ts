import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { fetchOgImage } from '@/utils/fetchOgImage';

// GET /api/restaurants/[id]/image - Fetch and store restaurant OG image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    
    // First get the restaurant to check if it already has a hero_image and get the website
    const { data: restaurant, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, website, hero_image')
      .eq('id', id)
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

    // If restaurant already has a hero_image and it's not empty, return it (including fallback)
    if (restaurant.hero_image && restaurant.hero_image.trim() !== '') {
      return NextResponse.json({
        success: true,
        data: { imageUrl: restaurant.hero_image, cached: true }
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
    let shouldStoreFallback = false;
    
    try {
      ogImageUrl = await fetchOgImage(restaurant.website);
    } catch (error) {
      console.error('Error fetching OG image:', error);
      // Store fallback image to prevent future attempts
      ogImageUrl = '/photo-missing.webp';
      shouldStoreFallback = true;
    }

    // If fetchOgImage returned "Image Not Found", store fallback
    if (ogImageUrl === "Image Not Found") {
      ogImageUrl = '/photo-missing.webp';
      shouldStoreFallback = true;
    }

    // Update restaurant with the fetched image URL using admin client
    const adminClient = createAdminClient();
    const { data: updatedRestaurant, error: updateError } = await adminClient
      .from('restaurants')
      .update({ 
        hero_image: ogImageUrl
      })
      .eq('id', id)
      .select('hero_image');

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
      data: { imageUrl: updatedRestaurant[0]?.hero_image || ogImageUrl, cached: false }
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