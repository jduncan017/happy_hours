/**
 * API Route for fetching pending restaurant submissions for admin review
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // TODO: Add admin role check here when user roles are implemented
    // For now, we'll assume any authenticated user can access this endpoint

    console.log('📋 Fetching pending submissions for admin review');

    // Fetch pending submissions with user profile information
    const { data: submissions, error: fetchError } = await supabase
      .from('restaurant_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching submissions:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch pending submissions'
      }, { status: 500 });
    }

    // Fetch user profiles separately for now (can be optimized later with proper foreign key setup)
    let submissionsWithProfiles = submissions;
    if (submissions && submissions.length > 0) {
      const userIds = [...new Set(submissions.map(s => s.submitted_by))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      // Merge profile data with submissions
      submissionsWithProfiles = submissions.map(submission => ({
        ...submission,
        profiles: profiles?.find(p => p.id === submission.submitted_by) || null
      }));
    }

    console.log(`✅ Found ${submissionsWithProfiles?.length || 0} pending submissions`);

    return NextResponse.json({
      success: true,
      submissions: submissionsWithProfiles || []
    });

  } catch (error) {
    console.error('❌ Error in pending-submissions API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}