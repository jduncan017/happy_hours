/**
 * Admin-only: list every pending restaurant_submissions row plus the
 * submitter's profile info.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Gate to admins. Non-admins get a clean 403 instead of "0 results"
    // confusion caused by RLS silently filtering them out.
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 },
      );
    }

    const { data: submissions, error: fetchError } = await supabase
      .from('restaurant_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching submissions:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pending submissions' },
        { status: 500 },
      );
    }

    // Pull submitter profiles in a single batch from user_profiles (was
    // previously hitting a non-existent `profiles` table — silent miss).
    let submissionsWithProfiles = submissions ?? [];
    if (submissions && submissions.length > 0) {
      const userIds = [...new Set(submissions.map((s) => s.submitted_by))];
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching submitter profiles:', profilesError);
      }

      submissionsWithProfiles = submissions.map((submission) => ({
        ...submission,
        profiles:
          profiles?.find((p) => p.id === submission.submitted_by) ?? null,
      }));
    }

    return NextResponse.json({
      success: true,
      submissions: submissionsWithProfiles,
    });
  } catch (error) {
    console.error('Error in pending-submissions API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}