/**
 * API Route for batch approving restaurant submissions
 * This converts approved submissions into live restaurant entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const BatchApproveSchema = z.object({
  submission_ids: z.array(z.string().uuid()).min(1, 'At least one submission ID is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('✅ Batch approval request received:', body);

    // Validate request body
    const { submission_ids } = BatchApproveSchema.parse(body);

    // Get authenticated user with regular client
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // TODO: Add admin role check here when user roles are implemented

    // Use service client for database operations
    const supabase = createServiceClient();

    console.log(`🔄 Processing batch approval for ${submission_ids.length} submissions`);

    // Fetch the submissions to approve
    const { data: submissions, error: fetchError } = await supabase
      .from('restaurant_submissions')
      .select('*')
      .in('id', submission_ids)
      .eq('status', 'pending');

    if (fetchError) {
      console.error('❌ Error fetching submissions:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch submissions for approval'
      }, { status: 500 });
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No pending submissions found with the provided IDs'
      }, { status: 404 });
    }

    console.log(`📋 Found ${submissions.length} submissions to approve`);

    // Process each submission and create restaurant entries
    const approvedSubmissions = [];
    const errors = [];

    for (const submission of submissions) {
      try {
        const extractedData = submission.extracted_data || {};
        
        // Prepare restaurant data from submission
        const restaurantData = {
          name: extractedData.name || 'Unnamed Restaurant',
          address: extractedData.address || '',
          area: extractedData.area || '',
          website: submission.website_url || extractedData.website || null,
          cuisine_type: extractedData.cuisine_type || null,
          menu_url: extractedData.menu_url || null,
          notes: extractedData.submission_notes ? [extractedData.submission_notes] : [],
          // Default values for required fields
          coordinates: null, // TODO: Add geocoding in the future
          happy_hours: {}, // TODO: Add happy hour extraction/input in the future
          price_category: '2', // Default to moderate pricing
          verified: false, // New restaurants start unverified
          created_by: user.id, // Track who approved the submission
        };

        console.log(`🍽️ Creating restaurant from submission: ${extractedData.name}`);
        console.log('📊 Restaurant data:', JSON.stringify(restaurantData, null, 2));

        // Insert into restaurants table
        const { data: restaurant, error: insertError } = await supabase
          .from('restaurants')
          .insert([restaurantData])
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Error creating restaurant for submission ${submission.id}:`, insertError);
          console.error('📊 Failed restaurant data:', JSON.stringify(restaurantData, null, 2));
          errors.push(`Failed to create restaurant: ${extractedData.name || submission.id} - ${insertError.message}`);
          continue;
        }

        // Update submission status to approved
        const { error: updateError } = await supabase
          .from('restaurant_submissions')
          .update({ 
            status: 'approved'
          })
          .eq('id', submission.id);

        if (updateError) {
          console.error(`❌ Error updating submission status for ${submission.id}:`, updateError);
          errors.push(`Failed to update submission status: ${extractedData.name || submission.id}`);
          continue;
        }

        approvedSubmissions.push({
          submission_id: submission.id,
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name
        });

        console.log(`✅ Successfully approved submission: ${extractedData.name} (${restaurant.id})`);

      } catch (error) {
        console.error(`❌ Error processing submission ${submission.id}:`, error);
        errors.push(`Error processing: ${submission.extracted_data?.name || submission.id}`);
      }
    }

    const successCount = approvedSubmissions.length;
    const errorCount = errors.length;

    console.log(`📊 Batch approval complete: ${successCount} approved, ${errorCount} errors`);

    // Return results
    return NextResponse.json({
      success: true,
      approved_count: successCount,
      error_count: errorCount,
      approved_submissions: approvedSubmissions,
      errors: errors
    });

  } catch (error) {
    console.error('❌ Error in batch-approve-submissions API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}