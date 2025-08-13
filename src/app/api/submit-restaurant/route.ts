/**
 * API Route for restaurant submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateSubmissionSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🍽️ Restaurant submission received:', body);

    // Validate the request body
    const validatedData = CreateSubmissionSchema.parse(body);

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required to submit restaurants'
      }, { status: 401 });
    }

    // Extract base URL from menu URL for duplicate checking
    let baseUrl: string | null = null;
    let hostname: string | null = null;
    if (validatedData.manual_data.menu_url) {
      try {
        const url = new URL(validatedData.manual_data.menu_url);
        baseUrl = `${url.protocol}//${url.hostname}`;
        hostname = url.hostname;
      } catch (error) {
        console.error('Invalid menu URL for duplicate checking:', error);
      }
    }

    // Check for duplicates using menu URL base domain
    if (baseUrl && hostname) {
      console.log('🔍 Checking for duplicates with base URL:', baseUrl);
      
      // Check existing restaurants
      const { data: existingRestaurants, error: restaurantCheckError } = await supabase
        .from('restaurants')
        .select('name, website')
        .eq('website', baseUrl);

      if (restaurantCheckError) {
        console.error('❌ Error checking existing restaurants:', restaurantCheckError);
      } else if (existingRestaurants && existingRestaurants.length > 0) {
        return NextResponse.json({
          success: false,
          error: `A restaurant with this website (${baseUrl}) already exists: ${existingRestaurants[0].name}. If this is a different location, please contact us.`
        }, { status: 409 });
      }

      // Check pending submissions
      const { data: pendingSubmissions, error: submissionCheckError } = await supabase
        .from('restaurant_submissions')
        .select('extracted_data')
        .eq('status', 'pending')
        .not('extracted_data', 'is', null);

      if (submissionCheckError) {
        console.error('❌ Error checking pending submissions:', submissionCheckError);
      } else if (pendingSubmissions && pendingSubmissions.length > 0) {
        // Check if any pending submission has the same base URL
        const duplicateSubmission = pendingSubmissions.find(submission => {
          if (submission.extracted_data?.website === baseUrl || 
              (submission.extracted_data?.menu_url && 
               submission.extracted_data.menu_url.includes(hostname))) {
            return true;
          }
          return false;
        });

        if (duplicateSubmission) {
          return NextResponse.json({
            success: false,
            error: `A restaurant submission with this website (${baseUrl}) is already pending review. Please wait for it to be processed.`
          }, { status: 409 });
        }
      }
    }

    // Prepare submission data with auto-populated website URL
    const submissionData = {
      submitted_by: user.id,
      website_url: baseUrl || null,
      extracted_data: {
        source: 'manual',
        ...validatedData.manual_data,
        website: baseUrl || null, // Auto-populate website from menu URL base
        submission_notes: validatedData.submission_notes,
      },
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    }

    console.log('🍽️ Prepared submission data:', submissionData);

    // Insert into database
    const { data: submission, error: insertError } = await supabase
      .from('restaurant_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save submission'
      }, { status: 500 });
    }

    console.log('✅ Restaurant submission saved:', submission.id);

    // TODO: In the future, we could:
    // 1. Send notification to admins
    // 2. Trigger automatic data extraction if URL is provided
    // 3. Send confirmation email to user

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
      message: 'Restaurant submitted successfully! Our team will review it soon.'
    });

  } catch (error) {
    console.error('❌ Restaurant submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid submission data',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to process restaurant submission'
    }, { status: 500 });
  }
}