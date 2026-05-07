import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { fetchOgImage } from '@/utils/fetchOgImage';
import { downloadAndStoreRestaurantImage } from '@/lib/storage/restaurantImages';
import { normalizeImageUrl } from '@/utils/image/normalizeImageUrl';

const FALLBACK_URL = '/photo-missing.webp';

// GET /api/restaurants/[id]/image — scrape OG image, persist bytes to
// Supabase Storage, save the storage URL on the restaurant row, return it.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();

    const { data: restaurant, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, website, hero_image')
      .eq('id', id)
      .single();

    if (fetchError || !restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 },
      );
    }

    // Already have an image (storage URL or sticky fallback) → return it.
    if (restaurant.hero_image && restaurant.hero_image.trim() !== '') {
      return NextResponse.json({
        success: true,
        data: { imageUrl: restaurant.hero_image, cached: true },
      });
    }

    if (!restaurant.website) {
      return NextResponse.json(
        { success: false, error: 'Restaurant has no website to fetch image from' },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();

    // 1. Scrape OG URL from the restaurant's site.
    let ogImageUrl: string | null = null;
    try {
      const scraped = await fetchOgImage(restaurant.website);
      if (scraped && scraped !== 'Image Not Found') {
        // Some sites serve protocol-relative URLs (//cdn/foo). Coerce to https.
        const normalized = normalizeImageUrl(scraped, '');
        ogImageUrl = normalized || null;
      }
    } catch (error) {
      console.error('Error fetching OG image:', error);
    }

    // 2. If we got a URL, download bytes and push to Supabase Storage.
    let storedUrl: string | null = null;
    if (ogImageUrl) {
      try {
        const result = await downloadAndStoreRestaurantImage(
          adminClient,
          id,
          restaurant.name,
          ogImageUrl,
        );
        storedUrl = result.publicUrl;
      } catch (error) {
        console.error(
          `Storage copy failed for restaurant ${id} (source ${ogImageUrl}):`,
          (error as Error).message,
        );
      }
    }

    // 3. Persist whichever URL we ended up with. Falling back to the static
    //    asset is sticky — we won't re-attempt OG scraping on every page load.
    const finalUrl = storedUrl ?? FALLBACK_URL;

    const { error: updateError } = await adminClient
      .from('restaurants')
      .update({ hero_image: finalUrl })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating restaurant heroImage:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save image to database',
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { imageUrl: finalUrl, cached: false },
    });
  } catch (error) {
    console.error('Error in restaurant image endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}