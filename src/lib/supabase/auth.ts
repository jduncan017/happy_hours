import { createClient as createServerClient } from "./server";
import { createClient as createBrowserClient } from "./client";
import type { SupabaseClient as BaseSupabaseClient } from '@supabase/supabase-js';

type SupabaseClient = BaseSupabaseClient | Awaited<ReturnType<typeof createServerClient>>;

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
}

// Get current user (server-safe)
export async function getCurrentUser(supabase: SupabaseClient) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

// Sign up with email and password
export async function signUp(supabase: SupabaseClient, email: string, password: string, userData?: {
  full_name?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  if (error) {
    console.error('Error signing up:', error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

// Sign in with email and password
export async function signIn(supabase: SupabaseClient, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

// Sign out
export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return { error };
  }

  return { error: null };
}

// Check if user is authenticated
export async function isAuthenticated(supabase: SupabaseClient): Promise<boolean> {
  const user = await getCurrentUser(supabase);
  return !!user;
}

// Get user profile with role
export async function getUserProfile(supabase: SupabaseClient): Promise<UserProfile | null> {
  const user = await getCurrentUser(supabase);
  
  if (!user) return null;
  
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    return {
      id: profile.id,
      email: user.email || '',
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role || 'user',
      created_at: profile.created_at
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

// Get user role (for backward compatibility)
export async function getUserRole(supabase: SupabaseClient): Promise<string | null> {
  const profile = await getUserProfile(supabase);
  return profile?.role || null;
}

// Check if user is admin
export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const role = await getUserRole(supabase);
  return role === 'admin';
}

// Check if user is restaurant owner or admin
export async function isRestaurantOwner(supabase: SupabaseClient): Promise<boolean> {
  const role = await getUserRole(supabase);
  return role === 'restaurant_owner' || role === 'admin';
}