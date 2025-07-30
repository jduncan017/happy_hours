import { createClient as createServerClient } from "./server";
import { createClient as createBrowserClient } from "./client";
import type { SupabaseClient as BaseSupabaseClient } from '@supabase/supabase-js';

type SupabaseClient = BaseSupabaseClient | Awaited<ReturnType<typeof createServerClient>>;

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
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

// Get user role (for future admin features)
export async function getUserRole(supabase: SupabaseClient): Promise<string | null> {
  const user = await getCurrentUser(supabase);
  
  if (!user) return null;
  
  // You can add custom role logic here
  // For now, we'll check user metadata
  return user.user_metadata?.role || 'user';
}