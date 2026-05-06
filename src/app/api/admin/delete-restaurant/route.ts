/**
 * API Route for deleting restaurants
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { deleteRestaurantImage } from '@/lib/storage/restaurantImages';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Read the row first so we know which storage object to remove afterwards.
    const { data: existing, error: readError } = await supabase
      .from('restaurants')
      .select('id, hero_image')
      .eq('id', restaurantId)
      .maybeSingle();

    if (readError) {
      console.error('Error reading restaurant before delete:', readError);
      return NextResponse.json(
        { success: false, error: readError.message },
        { status: 500 },
      );
    }

    const { error, data } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId)
      .select();

    if (error) {
      console.error('Error deleting restaurant:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    // Best-effort storage cleanup. Failure here doesn't roll back the
    // delete — the row is gone and an orphan object is recoverable.
    let imageRemoved = false;
    if (existing?.hero_image) {
      const result = await deleteRestaurantImage(supabase, existing.hero_image);
      imageRemoved = result.removed;
      if (result.error) {
        console.warn(
          `Restaurant ${restaurantId} deleted but storage cleanup failed: ${result.error}`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully',
      imageRemoved,
      deleted: data,
    });
  } catch (error) {
    console.error('Delete restaurant API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}