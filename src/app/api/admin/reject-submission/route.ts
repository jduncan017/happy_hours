/**
 * API Route for rejecting individual restaurant submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const RejectSubmissionSchema = z.object({
  submission_id: z.string().uuid('Invalid submission ID format')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('❌ Submission rejection request received:', body);

    // Validate request body
    const { submission_id } = RejectSubmissionSchema.parse(body);

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

    console.log(`🔄 Processing rejection for submission: ${submission_id}`);

    // Check if submission exists and is pending
    const { data: submission, error: fetchError } = await supabase
      .from('restaurant_submissions')
      .select('*')
      .eq('id', submission_id)
      .eq('status', 'pending')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching submission:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Submission not found or already processed'
      }, { status: 404 });
    }

    if (!submission) {
      return NextResponse.json({
        success: false,
        error: 'Submission not found or already processed'
      }, { status: 404 });
    }

    const restaurantName = submission.extracted_data?.name || 'Unnamed Restaurant';
    console.log(`📋 Rejecting submission: ${restaurantName}`);

    // Update submission status to rejected
    const { error: updateError } = await supabase
      .from('restaurant_submissions')
      .update({ 
        status: 'rejected'
      })
      .eq('id', submission_id);

    if (updateError) {
      console.error(`❌ Error updating submission status:`, updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to reject submission'
      }, { status: 500 });
    }

    console.log(`✅ Successfully rejected submission: ${restaurantName}`);

    return NextResponse.json({
      success: true,
      message: `Submission "${restaurantName}" has been rejected`,
      submission_id: submission_id
    });

  } catch (error) {
    console.error('❌ Error in reject-submission API:', error);

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